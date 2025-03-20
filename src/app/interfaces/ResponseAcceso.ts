import { User} from "./User";

export interface ResponseAcceso {
    accessToken:string,
    refreshToken:string,
    user:User
}