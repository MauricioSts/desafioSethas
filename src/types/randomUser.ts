export interface RandomUserResponse{
    results: RandomUserResult[];
}

export interface RandomUserResult{
    name:{ first: string; last: string};
    email:string;
    phone: string;
    cell: string;
    location:{
        street:{number:number; name:string};
        city:string;
        state:string;
        
    };
    dob:{date:string};
    registered: {date:string};
    login:{uuid:string};
}