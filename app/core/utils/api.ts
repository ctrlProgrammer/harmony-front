import { User, UserLogin, ValidateSession } from "../types";

export class APIUtils {
  static readonly HOST = "http://localhost:9101";
  static readonly DATA_HOST = "http://localhost:9102";

  static async GET(api: string, url: string) {
    const req = await fetch(api + url, {
      headers: {
        HARMONY_MICRO_SERVICES: "localkey",
      },
    });

    return await req.json();
  }

  static async POST(api: string, url: string, data: any) {
    const req = await fetch(api + url, {
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
    return APIUtils.POST(APIUtils.HOST, "/create-user", user);
  }

  static async Login(user: UserLogin) {
    return APIUtils.POST(APIUtils.HOST, "/login", user);
  }

  static async ValidateSession(validate: ValidateSession) {
    return APIUtils.POST(APIUtils.HOST, "/validate-session", validate);
  }

  // Data

  static async GetSellers() {
    return APIUtils.GET(APIUtils.DATA_HOST, "/sellers");
  }

  static async GetRegions() {
    return APIUtils.GET(APIUtils.DATA_HOST, "/districts");
  }
}
