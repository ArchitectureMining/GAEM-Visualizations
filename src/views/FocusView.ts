import * as d3 from "d3";
import { AggregateCall, ColumnData } from "./../model/ColumnData";
import { Neo4jDataModel } from "./../model/neo4j/Neo4jDataModel";
import { View } from "./View";

export class FocusView {
	public render(): void {
		let settings = {
			svgheight: 1000,
			svgwidth: 1200 // 1900 for line?
		};

		let dataModel = new Neo4jDataModel();
		dataModel.connect();
		dataModel.getColumnData(
			"class",
			"0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc." +
				"d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4." +
				"08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca." +
				"dfe1d833fd784cae1a235143479a591c9f1b49eaf79e9b1b562ec1c61964e655." +
				"f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d32e9efd3d",
			["053aad69a52634f446aa0a2fe92c8a3743716bdef437005f7f6ae7097a3c83af"]
		).then((data) => {

			console.log(data);

			let subElementNameList = data.subElements.map((value) => {
				return value.fullname;
			});

			// filter out internal calls and update subelement totals
			for (let subElement of data.subElements) {
				subElement.calls.to = subElement.calls.to.filter((value) => {
					return subElementNameList.indexOf(value.from) > -1;
				});
				subElement.totalCallsToThis = subElement.calls.to.reduce((total, current) => {
					return total += current.numberOfCalls;
				}, 0);
				subElement.totalCalls = subElement.totalCallsToThis + subElement.totalCallsFromThis;

				subElement.calls.from = subElement.calls.from.filter((value) => {
					return subElementNameList.indexOf(value.to) > -1 ;
				});
				subElement.totalCallsFromThis = subElement.calls.from.reduce((total, current) => {
					return total += current.numberOfCalls;
				}, 0);
				subElement.totalCalls = subElement.totalCallsToThis + subElement.totalCallsFromThis;
			}

			// update columndata totals
			data.totalCallsToThis = data.subElements.reduce((total, current) => {
				return total + current.totalCallsToThis;
			}, 0);

			data.totalCallsFromThis = data.subElements.reduce((total, current) => {
				return total + current.totalCallsFromThis;
			}, 0);

			data.totalCalls = data.subElements.reduce((total, current) => {
				return total + current.totalCalls;
			}, 0);

			console.log(data);

			// create data for right column based on the left
			let dataRight: ColumnData = {
				totalCallsToThis: 0,
				totalCallsFromThis: 0,
				totalCalls: 0,
				subElements: []
			};

			for (let subElement of data.subElements) {
				// from other to focus
				for (let aggregateCall of subElement.calls.to) {

					let index = dataRight.subElements.findIndex((rightDataElement) => {
						return rightDataElement.fullname === aggregateCall.from;
					});

					if (index < 0) {
						// create new
						dataRight.subElements.push({
							fullname: aggregateCall.from,
							name: aggregateCall.from.split(".").pop(),
							totalCallsToThis: 0,
							totalCallsFromThis: aggregateCall.numberOfCalls,
							totalCalls: aggregateCall.numberOfCalls,
							calls: {
								to: [],
								from: [aggregateCall]
							}
						});
					} else {
						// merge
						dataRight.subElements[index].totalCallsFromThis += aggregateCall.numberOfCalls;
						dataRight.subElements[index].totalCalls += aggregateCall.numberOfCalls;
						dataRight.subElements[index].calls.from.push(aggregateCall);
					}
					dataRight.totalCalls += aggregateCall.numberOfCalls;
					dataRight.totalCallsFromThis += aggregateCall.numberOfCalls;
				}

				// from focus to other
				for (let aggregateCall of subElement.calls.from) {

					let index = dataRight.subElements.findIndex((rightDataElement) => {
						return rightDataElement.fullname === aggregateCall.to;
					});

					if (index < 0) {
						// create new
						dataRight.subElements.push({
							fullname: aggregateCall.to,
							name: aggregateCall.to.split(".").pop(),
							totalCallsToThis: aggregateCall.numberOfCalls,
							totalCallsFromThis: 0,
							totalCalls: aggregateCall.numberOfCalls,
							calls: {
								to: [aggregateCall],
								from: []
							}
						});
					} else {
						// merge
						dataRight.subElements[index].totalCallsToThis += aggregateCall.numberOfCalls;
						dataRight.subElements[index].totalCalls += aggregateCall.numberOfCalls;
						dataRight.subElements[index].calls.to.push(aggregateCall);
					}
					dataRight.totalCalls += aggregateCall.numberOfCalls;
					dataRight.totalCallsToThis += aggregateCall.numberOfCalls;
				}
			}

			console.log(dataRight);

			// create svg container
			let svgContainer = d3
				.select("body")
				.append("svg")
				.attr("width", settings.svgwidth)
				.attr("height", settings.svgheight);

			// create focus group left
			let rectangleGroupLeft = svgContainer
				.selectAll("g.left")
				.data(data.subElements)
				.enter()
				.append("g")
				.attr("class", "left")
				.attr("id", (d, i) => {
					return d.fullname + "-group";
				});

			// left group main rectangle
			rectangleGroupLeft
				.append("rect")
				.attr("width", 300)
				.attr("height", (d, i) => {
					return (d.totalCalls / data.totalCalls) * settings.svgheight;
				})
				.attr("x", "0")
				.attr("y", (d, i) => {
					let previousTotalCalls = data.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return (previousTotalCalls / data.totalCalls) * settings.svgheight;
				})
				.attr("id", (d, i) => {
					return d.fullname;
				})
				.attr("fill", () => {
					return d3.interpolateCool(Math.random() * 0.5 + 0.5);
				})
				.attr("stroke", "black");

			// left group text
			/*rectangleGroupLeft
				.append("text")
				.attr("x", 10)
				.attr("y", (d, i) => {
					let previousTotalCalls = data.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return (previousTotalCalls / data.totalCalls) * settings.svgheight + 20;
					// maybe add text.bbox.y + 10?
					// cut off name
				})
				.text((d) => {
					return d.name;
				});*/

			// create call targets right
			let rectangleGroupRight = svgContainer
				.selectAll("g.right")
				.data(dataRight.subElements)
				.enter()
				.append("g")
				.attr("class", "right")
				.attr("id", (d, i) => {
					return d.fullname + "-group";
				});

			// right group main rectangle
			rectangleGroupRight
				.append("rect")
				.attr("width", 300)
				.attr("height", (d, i) => {
					return (d.totalCalls / dataRight.totalCalls) * settings.svgheight;
				})
				.attr("x", settings.svgwidth - 300)
				.attr("y", (d, i) => {
					let previousTotalCalls = dataRight.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return (previousTotalCalls / data.totalCalls) * settings.svgheight;
				})
				.attr("id", (d, i) => {
					return d.fullname;
				})
				.attr("fill", () => {
					return d3.interpolateCool(Math.random() * 0.5);
				})
				.attr("stroke", "black");

			// right group text
			/*rectangleGroupRight
				.append("text")
				.attr("x", settings.svgwidth - 240)
				.attr("y", (d, i) => {
					let previousTotalCalls = dataRight.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return (previousTotalCalls / data.totalCalls) * settings.svgheight + 20; // maybe add text.bbox.y + 10?
				})
				.text((d) => {
					return d.fullname;
				});*/

			// create smaller connectors (left)
			for (let dataElement of data.subElements) {
				let connectorGroup = svgContainer
					.select("#" + dataElement.fullname + "-group")
					.append("g")
					.attr("id", dataElement.fullname + "-connectors");

				// create connectors for from this to other
				for (let call of dataElement.calls.from) {
					connectorGroup
						.append("rect")
						.attr("width", 50)
						.attr("height", () => {
							let localTotal = dataElement.totalCallsToThis + dataElement.totalCallsFromThis;
							let dataElementHeight = (localTotal / data.totalCalls) * settings.svgheight;

							let callTotal = call.from + call.to;
							return (data.totalCalls / dataElement.totalCalls * dataElementHeight);
						})
						.attr("x", 250)
						.attr("y", () => {
							let previousCallTotal = 0;
							let k: number;
							for (k = 0; k < j; k++) {
								previousCallTotal += dataElement.calls[k].from;
								previousCallTotal += dataElement.calls[k].to;
							}

							let previousTotalCalls = dataRight.subElements.slice(0, i).reduce((total, current) => {
								return total + current.totalCalls;
							}, 0);

							let previousTotal = sumPreviousCalls(data1, i);
							let mainRectHeight = (dataElement.totalCalls / data.totalCalls) * settings.svgheight;
							let mainRectY = (previousTotal / data.totalCalls) * settings.svgheight;

							return mainRectY + (previousCallTotal / dataElement.totalCalls * mainRectHeight) ;
						})
						.attr("fill", () => {
							return d3.select("#" + call.fullname).attr("fill");
						})
						.attr("stroke", "black")
						.attr("id", dataElement.fullname + "-" + call.fullname);
				}
			}

			// create smaller connectors (right)
			/*data2.forEach((dataElement, i) => {
				let connectorGroup = svgContainer
					.select("#" + dataElement.fullname + "-group")
					.append("g")
					.attr("id", dataElement.fullname + "-connectors");
				dataElement.calls.forEach((call, j) => {
					connectorGroup
						.append("rect")
						.attr("width", 50)
						.attr("height", () => {
							let total = sumTotalCalls(data2);
							let localTotal = dataElement.incoming + dataElement.outgoing;
							let mainRectHeight = (localTotal / total) * settings.svgheight;

							let elementTotal = dataElement.incoming + dataElement.outgoing;
							let callTotal = call.from + call.to;
							return (callTotal / elementTotal * mainRectHeight);
						})
						.attr("x", settings.svgwidth - 300)
						.attr("y", () => {
							let elementTotal = dataElement.incoming + dataElement.outgoing;

							let previousCallTotal = 0;
							let k: number;
							for (k = 0; k < j; k++) {
								previousCallTotal += dataElement.calls[k].from;
								previousCallTotal += dataElement.calls[k].to;
							}

							let total = sumTotalCalls(data2);
							let previousTotal = sumPreviousCalls(data2, i);
							let localTotal = dataElement.incoming + dataElement.outgoing;
							let mainRectHeight = (localTotal / total) * settings.svgheight;
							let mainRectY = (previousTotal / total) * settings.svgheight;

							return mainRectY + (previousCallTotal / elementTotal * mainRectHeight) ;
						})
						.attr("fill", () => {
							return d3.select("#" + call.fullname).attr("fill");
						})
						.attr("stroke", "black")
						.attr("id", dataElement.fullname + "-" + call.fullname);
				});
			});

			svgContainer
				.append("g")
				.attr("id", "roads");

			// create from left to right
			data1.forEach((dataElement, i) => {
				let roads = d3.select("#roads");
				dataElement.calls.forEach((call, j) => {
					roads
						.append("polygon")
						.attr("points", () => {
							let points: string[] = [];
							let connectorFrom = svgContainer
								.select("#" + dataElement.fullname + "-" + call.fullname);
							let connectorTo = svgContainer
								.select("#" + call.fullname + "-" + dataElement.fullname);
							let ratio: number = call.to / (call.from + call.to);

							points.push( // top left
								(parseInt(connectorFrom.attr("x"))
									+ parseInt(connectorFrom.attr("width")))
								+ ","
								+ connectorFrom.attr("y"));
							points.push( // top right
								connectorTo.attr("x")
								+ ","
								+ connectorTo.attr("y"));
							points.push( // bottom right
								connectorTo.attr("x")
								+ ","
								+ (parseInt(connectorTo.attr("y"))
									+ parseInt(connectorTo.attr("height")) * ratio));
							points.push( // bottom left
								parseInt(connectorFrom.attr("x"))
									+ parseInt(connectorFrom.attr("width"))
								+ ","
								+ (parseInt(connectorFrom.attr("y"))
									+ parseInt(connectorFrom.attr("height")) * ratio));
							return points.join(" ");
						})
						.attr("id", () => {
							return "#" + dataElement.fullname + "-" + call.fullname;
						})
						.attr("fill", () => {
							return d3.select("#" + dataElement.fullname).attr("fill");
						})
						.attr("stroke", "black")
						.attr("opacity", 0.6);
				});
			});

			// create from right to left
			data2.forEach((dataElement, i) => {
				let roads = d3.select("#roads");
				dataElement.calls.forEach((call, j) => {
					roads
					.append("polygon")
					.attr("points", () => {
						let points: string[] = [];
						let connectorFrom = svgContainer
							.select("#" + dataElement.fullname + "-" + call.fullname);
						let connectorTo = svgContainer
							.select("#" + call.fullname + "-" + dataElement.fullname);
						let ratio: number = call.from / (call.from + call.to);

						points.push( // top left
							(parseInt(connectorTo.attr("x"))
								+ parseInt(connectorTo.attr("width")))
							+ ","
							+ (parseInt(connectorTo.attr("y"))
								+ parseInt(connectorTo.attr("height")) * ratio));
						points.push( // top right
							connectorFrom.attr("x")
							+ ","
							+ (parseInt(connectorFrom.attr("y"))
								+ parseInt(connectorFrom.attr("height")) * ratio));
						points.push( // bottom right
							connectorFrom.attr("x")
							+ ","
							+ (parseInt(connectorFrom.attr("y"))
								+ parseInt(connectorFrom.attr("height"))));
						points.push( // bottom left
							parseInt(connectorTo.attr("x"))
								+ parseInt(connectorTo.attr("width"))
							+ ","
							+ (parseInt(connectorTo.attr("y"))
								+ parseInt(connectorTo.attr("height"))));
						return points.join(" ");
					})
					.attr("id", () => {
						return "#" + dataElement.fullname + "-" + call.fullname;
					})
					.attr("fill", () => {
						return d3.select("#" + dataElement.fullname).attr("fill");
					})
					.attr("stroke", "black")
					.attr("opacity", 0.6);
				});
			});*/
		}).catch((reason) => {
			console.log(reason);
		});
	}
}
