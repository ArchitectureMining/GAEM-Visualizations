export interface DataModel {
	connect(): void;
	getColumnData(elementType: string, fullname: string, runs: string[]);
	// return promise? so we can wait on multiple calls before rendering
	// return [ComponentData[]]? 1 per column?
	disconnect(): void;
}

/*export interface ComponentData {
	fullname: string;
	incoming: number;
	outgoing: number;
	calls: CallData[];
}

export interface CallData {
	fullname: string;
	from: number;
	to: number;
}*/
