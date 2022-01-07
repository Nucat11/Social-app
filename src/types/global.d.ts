interface Inputs {
  post: string;
  emailLogin: string;
  passwordLogin: string;
  fullname: string;
  date: Date;
  acceptTerms: boolean;
  preventDefault: function;
  id: string | any;
  comment: string;
  avatar: File;
  parentID: string;
}
interface Post {
  comments: {
    comment: string;
    fullname: string;
  }
  date: string;
  post: string;
}