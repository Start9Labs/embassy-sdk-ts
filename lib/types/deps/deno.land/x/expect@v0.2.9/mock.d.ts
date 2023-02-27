export type MockCall = {
    args: any[];
    returned?: any;
    thrown?: any;
    timestamp: number;
    returns: boolean;
    throws: boolean;
};
export declare function fn(...stubs: Function[]): (...args: any[]) => any;
export declare function calls(f: Function): MockCall[];
