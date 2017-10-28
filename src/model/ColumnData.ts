export interface ColumnData {
	fullname?: string;
	totalCallsToThis: number;
	totalCallsFromThis: number;
	totalCalls: number;
	subElements: SubElement[];
}

export interface SubElement {
	name: string;
	fullname: string;
	calls: {
		to: AggregateCall[],
		from: AggregateCall[]
	};
	totalCallsToThis: number;
	totalCallsFromThis: number;
	totalCalls: number;
}

export interface AggregateCall {
	from: string;
	to: string;
	numberOfCalls: number;
}
