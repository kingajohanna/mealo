//
//  ReminderModule.swift
//  mealo
//
//  Created by Kinga Szabo on 13/01/2024.
//

import Foundation
import EventKit

@objc(ReminderModule)
class ReminderModule: NSObject {
    @objc static func requiresMainQueueSetup() -> Bool { return true }
  
    static func moduleName() -> String {
        return "ReminderModule"
    }

    @objc func fetchEvents(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let eventStore = EKEventStore()
        eventStore.requestAccess(to: .event) { (granted, error) in
  
                let calendar = Calendar.current
                let startDate = Date()
                let endDate = calendar.date(byAdding: .year, value: 1, to: startDate)!

                let predicate = eventStore.predicateForEvents(withStart: startDate, end: endDate, calendars: nil)
                let events = eventStore.events(matching: predicate)

                var formattedEvents: [[String: Any]] = []
                for event in events {
                    formattedEvents.append([
                        "title": event.title ?? "",
                        "startDate": event.startDate.timeIntervalSince1970,
                        "endDate": event.endDate.timeIntervalSince1970
                    ])
                }

                resolve(formattedEvents)
         
        }
    }

    @objc func addEvent(_ title: String, startDate: Double, endDate: Double, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let eventStore = EKEventStore()
        eventStore.requestAccess(to: .event) { (granted, error) in
   
                let event = EKEvent(eventStore: eventStore)
                event.title = title
                let startDateInterval = TimeInterval(startDate / 1000)
                event.startDate = Date(timeIntervalSince1970: startDateInterval)
                let endDateInterval = TimeInterval(endDate / 1000)
                event.endDate = Date(timeIntervalSince1970: endDateInterval)
                event.calendar = eventStore.defaultCalendarForNewEvents

              
                do {
                    try eventStore.save(event, span: .thisEvent)
                    resolve("Event added successfully")
                } catch let error as NSError {
                    reject("event_add_error", "Error adding event", error)
                }
         
        }
    }
  
    @objc func fetchReminders(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
          let eventStore = EKEventStore()
          eventStore.requestAccess(to: .reminder) { (granted, error) in
            
              var mealoCalendar: EKCalendar?
              let calendars = eventStore.calendars(for: .reminder)
            
              for calendar in calendars {
                  if calendar.title == "Mealo" {
                      mealoCalendar = calendar
                      break
                  }
              }
              
              guard mealoCalendar != nil else {
                return reject("reminder_add_error", "Error adding reminder", error)
              }
        
              let predicate = eventStore.predicateForReminders(in: [mealoCalendar!])
              eventStore.fetchReminders(matching: predicate, completion: { (reminders) in
              
                  var formattedReminders: [[String: Any]] = []
                  for reminder in reminders ?? [] {
                      formattedReminders.append([
                        "id": reminder.calendarItemIdentifier,
                          "title": reminder.title ?? "",
                          "notes": reminder.notes ?? "",
                          "completed": reminder.isCompleted
                      ])
                  }

                  resolve(formattedReminders)
              })
          }
      }
  
  
  @objc func createCalendar(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let eventStore = EKEventStore()
        eventStore.requestAccess(to: .reminder) { (granted, error) in
      
          var mealoCalendar: EKCalendar?
          let calendars = eventStore.calendars(for: .reminder)
        
          for calendar in calendars {
              if calendar.title == "Mealo" {
                  mealoCalendar = calendar
                  break
              }
          }
          
          guard mealoCalendar == nil else {
            return
          }

          mealoCalendar = EKCalendar(for: .reminder, eventStore: eventStore)
          mealoCalendar!.title = "Mealo"
          mealoCalendar!.cgColor = UIColor(red: 0.05, green: 0.54, blue: 0.46, alpha: 1.00).cgColor
          mealoCalendar!.source = eventStore.defaultCalendarForNewReminders()?.source
          do {
              try eventStore.saveCalendar(mealoCalendar!, commit: true)
              resolve("Reminder added successfully")
          } catch let error as NSError {
              reject("calendar_creation_error", "Error creating 'Mealo' calendar", error)
          }
      }
    }
  


  @objc func addReminder(_ title: String, note: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
          let eventStore = EKEventStore()
          eventStore.requestAccess(to: .reminder) { (granted, error) in

            var mealoCalendar: EKCalendar?
            let calendars = eventStore.calendars(for: .reminder)

            for calendar in calendars {
                if calendar.title == "Mealo" {
                    mealoCalendar = calendar
                    break
                }
            }
            
            guard mealoCalendar != nil else {
              return reject("reminder_add_error", "Error adding reminder", error)
            }

            let reminder = EKReminder(eventStore: eventStore)
            reminder.title = title
            reminder.notes = note
            reminder.calendar = mealoCalendar


              do {
                  try eventStore.save(reminder, commit: true)
                  
                  resolve([
                      "id": reminder.calendarItemIdentifier,
                      "title": reminder.title ?? "",
                      "notes": reminder.notes ?? "",
                      "completed": reminder.isCompleted
                  ])
              } catch let error as NSError {
                  reject("reminder_add_error", "Error adding reminder", error)
              }
          }
      }
  
  @objc func completeReminder(_ identifier: String, completed: Int, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      let eventStore = EKEventStore()
      eventStore.requestAccess(to: .reminder) { (granted, error) in
          var mealoCalendar: EKCalendar?
          let calendars = eventStore.calendars(for: .reminder)

          for calendar in calendars {
              if calendar.title == "Mealo" {
                  mealoCalendar = calendar
                  break
              }
          }

          guard let mealoCalendar = mealoCalendar else {
              return reject("reminder_add_error", "Error adding reminder", error)
          }

          let predicate = eventStore.predicateForReminders(in: [mealoCalendar])
          eventStore.fetchReminders(matching: predicate) { (reminders) in
              guard let reminders = reminders else {
                  return reject("reminder_fetch_error", "Error fetching reminders", error)
              }

              for reminder in reminders {
                  if reminder.calendarItemIdentifier == identifier {
                    reminder.isCompleted = completed == 0 ? false : true

                      do {
                          try eventStore.save(reminder, commit: true)
                          resolve("Reminder updated successfully")
                      } catch let saveError as NSError {
                          reject("reminder_save_error", "Error saving updated reminder", saveError)
                      }
                      return
                  }
              }

              reject("reminder_not_found", "Reminder not found", nil)
          }
      }
  }
  
  @objc func removeReminder(_ identifier: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      let eventStore = EKEventStore()
      eventStore.requestAccess(to: .reminder) { (granted, error) in
          var mealoCalendar: EKCalendar?
          let calendars = eventStore.calendars(for: .reminder)

          for calendar in calendars {
              if calendar.title == "Mealo" {
                  mealoCalendar = calendar
                  break
              }
          }

          guard let mealoCalendar = mealoCalendar else {
              return reject("reminder_add_error", "Error adding reminder", error)
          }

          let predicate = eventStore.predicateForReminders(in: [mealoCalendar])
          eventStore.fetchReminders(matching: predicate) { (reminders) in
              guard let reminders = reminders else {
                  return reject("reminder_fetch_error", "Error fetching reminders", error)
              }

              for reminder in reminders {
                  if reminder.calendarItemIdentifier == identifier {
            

                      do {
                        try eventStore.remove(reminder, commit: true)
                          resolve("Reminder deleted successfully")
                      } catch let saveError as NSError {
                          reject("reminder_delete_error", "Error deleting reminder", saveError)
                      }
                      return
                  }
              }

              reject("reminder_not_found", "Reminder not found", nil)
          }
      }
  }
}
