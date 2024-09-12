export type GetEarnDataResponseItem = {
    name: string,
    description: string,
    reward: string,
    reward1: string,
    reward2: string,
    reward3: string,
    reward_symbol: string,
    end_time: number,
    id: number,
    total_clicks: number,
    link: string,
    image_link: string,
    task_list: string[]
};

export type GetEarnDataResponse = {
    error: boolean;
    message?: string;
    payload?: {
        tasks: GetEarnDataResponseItem[],
        user_level: number
    };
};

export type EarnApi = {
    getData: () => Promise<GetEarnDataResponse>;
    taskJoined: (data: { id: number }) => Promise<{ 
        error: boolean, 
        message: string,
        payload?: any // Adding payload as optional for flexibility
    }>;
};