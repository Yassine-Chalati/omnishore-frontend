class Authentication {
    access_token: string
    refresh_token: string

    public constructor(access_token: string, refresh_token:string) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}

export { Authentication }