// look into structure with element1, element2, number1->2, number2->1
// maybe even just target, numberTo, numberFrom?
export class AggregateCall {
	constructor(
		public from: string,
		public to: string,
		public totalCalls: number
	) {

	}
}

export class SubElement {
	constructor(
		public column: ColumnData,
		public fullname: string
	) {

	}

	get name(): string {
		return this.fullname.split(".").pop();
	}

	get calls(): AggregateCall[] {
		return this.column.calls.filter((call) => {
			return (call.from === this.fullname || call.to === this.fullname);
		});
	}

	get internalCalls(): AggregateCall[] {
		return this.calls.filter((call) => {
			return (this.column.subElementFullnames.some((value) => {
				return call.from === value;
			}) && this.column.subElementFullnames.some((value) => {
				return call.to === value;
			}));
		});
	}

	get totalInternalCalls(): number {
		return this.internalCalls.reduce((total, current) => {
			return total + current.totalCalls;
		}, 0);
	}

	get totalInternalCallsToThisElement(): number {
		return this.internalCalls.reduce((total, call) => {
			if (call.to === this.fullname) {
				return total + call.totalCalls;
			} else {
				return total;
			}
		}, 0);
	}

	get totalInternalCallsFromThisElement(): number {
		return this.internalCalls.reduce((total, call) => {
			if (call.from === this.fullname) {
				return total + call.totalCalls;
			} else {
				return total;
			}
		}, 0);
	}

	get externalCalls(): AggregateCall[] {
		return this.calls.filter((call) => {
			return !(this.column.subElementFullnames.some((value) => {
				return call.from === value;
			}) && this.column.subElementFullnames.some((value) => {
				return call.to === value;
			}));
		});
	}

	get totalExternalCalls(): number {
		return this.externalCalls.reduce((total, current) => {
			return total + current.totalCalls;
		}, 0);
	}

	get totalExternalCallsToThisElement(): number {
		return this.externalCalls.reduce((total, call) => {
			if (call.to === this.fullname) {
				return total + call.totalCalls;
			} else {
				return total;
			}
		}, 0);
	}

	get totalExternalCallsFromThisElement(): number {
		return this.externalCalls.reduce((total, call) => {
			if (call.from === this.fullname) {
				return total + call.totalCalls;
			} else {
				return total;
			}
		}, 0);
	}

	get totalCallsToThisElement(): number {
		return this.calls.reduce((total, call) => {
			if (call.to === this.fullname) {
				return total + call.totalCalls;
			} else {
				return total;
			}
		}, 0);
	}

	get totalCallsFromThisElement(): number {
		return this.calls.reduce((total, call) => {
			if (call.from === this.fullname) {
				return total + call.totalCalls;
			} else {
				return total;
			}
		}, 0);
	}

	get totalCalls(): number {
		return this.calls.reduce((total, call) => {
			return total + call.totalCalls;
		}, 0);
	}
}

// columnData fullname has no use up until now, so is excluded on purpose.
export class ColumnData {
	public subElements: SubElement[] = [];
	public calls: AggregateCall[] = [];

	get subElementFullnames(): string[] {
		return this.subElements.map((element) => {
			return element.fullname;
		});
	}

	get internalCalls(): AggregateCall[] {
		return this.subElements.reduce((total, current) => {
			return total.concat(current.internalCalls);
		}, new Array<AggregateCall>());
	}

	// internal calls to/from this = total internal calls

	get totalInternalCalls(): number {
		return this.subElements.reduce((total, current) => {
			return total + current.totalInternalCalls;
		}, 0);
	}

	get externalCalls(): AggregateCall[] {
		return this.subElements.reduce((total, current) => {
			return total.concat(current.externalCalls);
		}, new Array<AggregateCall>());
	}

	get totalExternalCallsToThisColumn(): number {
		return this.subElements.reduce((total, current) => {
			return total + current.totalExternalCallsToThisElement;
		}, 0);
	}

	get totalExternalCallsFromThisColumn(): number {
		return this.subElements.reduce((total, current) => {
			return total + current.totalExternalCallsFromThisElement;
		}, 0);
	}

	get totalExternalCalls(): number {
		return this.subElements.reduce((total, current) => {
			return total + current.totalExternalCalls;
		}, 0);
	}

	get totalCallsToThisColumn(): number {
		return this.subElements.reduce((total, current) => {
			return total + current.totalCallsToThisElement;
		}, 0);
	}

	get totalCallsFromThisColumn(): number {
		return this.subElements.reduce((total, current) => {
			return total + current.totalCallsFromThisElement;
		}, 0);
	}

	get totalCalls(): number {
		return this.totalCallsToThisColumn + this.totalCallsFromThisColumn;
	}

	// optional: add internal/external accessors as well?
}
