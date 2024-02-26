export const removeFields = (obj: any, fieldsToRemove: string[]) => {
  for (const field of fieldsToRemove) {
    delete obj[field];
  }
};
