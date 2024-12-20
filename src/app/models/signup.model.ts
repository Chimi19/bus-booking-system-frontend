export interface SignupModel {
  name:string;
  address:string;
    email: string;
    password: string;
    confirmPassword?: string;
  }

  export interface LoginResponseModel {
    accessToken: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }