import { User, UserLogin, ValidateSession } from "../types";

export class APIUtils {
  static readonly HOST = "http://localhost:9101";

  static async GET(url: string) {
    const req = await fetch(APIUtils.HOST + url, {
      headers: {
        HARMONY_MICRO_SERVICES: "localkey",
      },
    });

    return await req.json();
  }

  static async POST(url: string, data: any) {
    const req = await fetch(APIUtils.HOST + url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        HARMONY_MICRO_SERVICES: "localkey",
      },
    });

    return await req.json();
  }

  // Login

  static async CreateUser(user: User) {
    return APIUtils.POST("/create-user", user);
  }

  static async Login(user: UserLogin) {
    return APIUtils.POST("/login", user);
  }

  static async ValidateSession(validate: ValidateSession) {
    return APIUtils.POST("/validate-session", validate);
  }
}
