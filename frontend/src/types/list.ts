export type ListItem = {
  id: string;
  name: string;
  amount: string;
  completed: boolean;
};

export type List = {
  id: string;
  uid: string;
  list: string[];
};
