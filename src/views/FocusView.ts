import * as d3 from "d3";
import { AggregateCall, ColumnData, SubElement } from "./../model/ColumnData";
import { Neo4jDataModel } from "./../model/neo4j/Neo4jDataModel";
import { View } from "./View";

export class FocusView implements View {
	public dataModel = new Neo4jDataModel();

	public settings: {
		element: {
			type: string,
			fullname: string
		},
		runs: string[],
		includeinternal: boolean,
		svgheight: number,
		svgwidth: number,
		columnwidth: number,
		connectorwidth: number,
		showconnector: boolean,
		showtext: boolean
	} = {
		// data settings
		element: {
			type: undefined,
			fullname: undefined
		},
		runs: [],
		includeinternal: undefined,
		// graphic settings
		svgheight: undefined,
		svgwidth: undefined,
		columnwidth: undefined,
		connectorwidth: undefined,
		showconnector: undefined,
		showtext: undefined
	};

	constructor() {
		this.dataModel.connect();

		// settings menu
		{
			let settingsdiv = d3
				.select("div#settings");

			// render settings header
			settingsdiv
				.append("b")
				.html("Settings");
			// render update button
			settingsdiv
				.append("button")
					.attr("id", "update")
					.html("Render / Update")
					.on("click", () => {
						this.remove();
						this.render();
					});

			// render focus settings
			settingsdiv
				.call((selection) => {
					let focussetting = selection
						.append("p");
					focussetting
						.html("Focus element <br/> (dropdown is slow) <br/>");
					focussetting
						.append("select")
							.attr("class", "setting")
							.attr("id", "focustype")
							.call((optionselection) => {
								optionselection
									.append("option")
									.attr("value", "class")
									.html("class");
								optionselection
									.append("option")
									.attr("value", "struct")
									.html("struct");
							})
							.on("change", () => {
								let typesetting = d3
									.select(".setting#focustype").property("value");
								this.dataModel.getFocusFullnames(typesetting)
								.then((value) => {
									// no idea why i can't get d3 exit().remove() working, but for now this just works
									d3
										.select(".setting#focusname")
										.selectAll("option")
										.remove();

									let enterselection = d3
										.select(".setting#focusname")
										.selectAll("option")
										.data(value);

									enterselection
										.enter()
										.append("option")
										.attr("value", (d, i) => {
											return d;
										})
										.html((d, i) => {
											return d;
										});

									// set a defaukt for easy debugging
									if (typesetting === "class") {
										d3
											.select(".setting#focusname")
											.select("option[value=\"7330db8e941459cf28fef7250e424fa6ae90c9f73e5dbfb39beebdda25995daf\"]")
											.property("selected", true);
									}
								})
								.catch((reason) => {
									console.log(reason);
								});
							});
					focussetting
						.append("br");
					focussetting
						.append("select")
							.attr("class", "setting")
							.attr("id", "focusname")
							.attr("style", "max-width: 200px");

					let selecttype = d3.select(".setting#focustype").node() as HTMLSelectElement;
					selecttype.dispatchEvent(new Event("change"));
				});

			// render runs settings
			settingsdiv
				.append("p")
					.html("Runs / use cases <br/>")
					.append("select")
						.attr("multiple", true)
						.attr("class", "setting")
						.attr("id", "runs")
						.attr("style", "max-width: 200px");

			// render internals setting
			settingsdiv
				.append("p")
					.html("Incude internal calls <br/> <i>Nonfunctional switch</i> <br/>")
					.append("label")
						.attr("class", "switch")
						.call((switchselection) => {
							switchselection
								.append("input")
									.attr("type", "checkbox")
									.attr("class", "setting")
									.attr("id", "internals")
									.property("checked", true);
							switchselection
								.append("span")
									.attr("class", "slider");
						});

			// render svgheight setting
			settingsdiv
				.append("p")
					.html("SVG canvas height <br/>")
					.append("input")
						.attr("type", "text")
						.attr("class", "setting")
						.attr("id", "svgheight")
						.attr("value", 800);

			// render svgwidth setting
			settingsdiv
				.append("p")
					.html("SVG canvas width <br/>")
					.append("input")
						.attr("type", "text")
						.attr("class", "setting")
						.attr("id", "svgwidth")
						.attr("value", 1200);

			// render columnwidth setting
			settingsdiv
				.append("p")
					.html("Column width <br/>")
					.append("input")
						.attr("type", "text")
						.attr("class", "setting")
						.attr("id", "columnwidth")
						.attr("value", 200);

			// render connectorwidth setting
			settingsdiv
				.append("p")
					.html("Connector width <br/>")
					.append("input")
						.attr("type", "text")
						.attr("class", "setting")
						.attr("id", "connectorwidth")
						.attr("value", 30);

			// render showconnector setting
			settingsdiv
				.append("p")
					.html("Show connectors <br/> <i>Nonfunctional switch</i> <br/>")
					.append("label")
						.attr("class", "switch")
						.call((switchselection) => {
							switchselection
								.append("input")
									.attr("type", "checkbox")
									.attr("class", "setting")
									.attr("id", "showconnector")
									.property("checked", true);
							switchselection
								.append("span")
									.attr("class", "slider");
						});

			// render showtext setting
			settingsdiv
				.append("p")
					.html("Show text <br/>")
					.append("label")
						.attr("class", "switch")
						.call((switchselection) => {
							switchselection
								.append("input")
									.attr("type", "checkbox")
									.attr("class", "setting")
									.attr("id", "showtext")
									.property("checked", true);
							switchselection
								.append("span")
									.attr("class", "slider");
						});

			// get runs data
			this.dataModel.getRuns()
				.then((value) => {
					// render runs setting
					d3
						.select("select.setting#runs")
						.selectAll("option")
						.data(value)
						.enter()
						.append("option")
						.attr("value", (d, i) => {
							return d;
						})
						.html((d, i) => {
							return d;
						});
					// default selection
					d3
						.select("select.setting#runs")
						.select("option[value=\"053aad69a52634f446aa0a2fe92c8a3743716bdef437005f7f6ae7097a3c83af\"]")
						.attr("selected", "");
				});
		}
	}

	public render(): void {
		this.readsettings();

		// https://stackoverflow.com/questions/15975440/add-ellipses-to-overflowing-text-in-svg
		// slight adaptation to use settings
		function wrap(selection, columnwidth, connectorwidth) {
			selection.each(function() {
				let self = d3.select(this);
				let textLength = self.node().getComputedTextLength();
				let text = self.text();
				let width = columnwidth - connectorwidth;
				let padding = 3;

				while (textLength > (width - 2 * padding) && text.length > 0) {
					text = text.slice(0, -1);
					self.text(text + "\u2026");
					textLength = self.node().getComputedTextLength();
				}
			});
		}

		this.dataModel.getColumnData(
			this.settings.element.type,
			this.settings.element.fullname,
			this.settings.runs
		).then((dataFocus) => {
			dataFocus.subElements = dataFocus.subElements.filter((subElement) => {
				return subElement.totalCalls > 0;
			});

			let dataRight: ColumnData = new ColumnData();

			for (let externalCall of dataFocus.externalCalls) {
				// left -> right
				if (dataFocus.subElementFullnames.some((value) => {
					return value === externalCall.from;
				}) && !dataRight.subElementFullnames.some((value) => {
					return value === externalCall.to;
				})) {
					dataRight.subElements.push(new SubElement(dataRight, externalCall.to));
				}

				// right -> left
				if (dataFocus.subElementFullnames.some((value) => {
					return value === externalCall.to;
				}) && !dataRight.subElementFullnames.some((value) => {
					return value === externalCall.from;
				})) {
					dataRight.subElements.push(new SubElement(dataRight, externalCall.from));
				}

				// add the call to the right side
				// on purpose new aggregatecall to create new object instead of pointer
				dataRight.calls.push(new AggregateCall(
					externalCall.from,
					externalCall.to,
					externalCall.totalCalls
				));
			}

			let columnHeights: number[] = [
				this.settings.svgheight,
				dataRight.totalCalls / dataFocus.totalCalls * this.settings.svgheight
			];

			// create svg container
			let svgContainer = d3
				.select("#svg")
				.append("svg")
				.attr("width", this.settings.svgwidth)
				.attr("height", this.settings.svgheight);

			// create group left column
			let rectangleGroupLeft = svgContainer
				.selectAll("g.left")
				.data(dataFocus.subElements)
				.enter()
				.append("g")
				.attr("class", "left")
				.attr("id", (d, i) => {
					return d.fullname + "-group";
				});

			// create left column
			rectangleGroupLeft
				.append("rect")
				.attr("width", this.settings.columnwidth)
				.attr("height", (d, i) => {
					return (d.totalCalls / dataFocus.totalCalls) * columnHeights[0];
				})
				.attr("x", "0")
				.attr("y", (d, i) => {
					let previousTotalCalls = dataFocus.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return (previousTotalCalls / dataFocus.totalCalls) * columnHeights[0];
				})
				.attr("id", (d, i) => {
					return d.fullname;
				})
				.attr("fill", () => {
					return d3.interpolateCool(Math.random() * 0.5 + 0.5);
				})
				.attr("stroke", "black")
				.each(function(d, i) {
					let self = d3.select(this);
					let title = self.append("title");

					title.text(
						"fullname: " + d.fullname + "\n" +
						"total calls to this element: " + d.totalCallsToThisElement + "\n" +
						"total calls from this element: " + d.totalExternalCallsFromThisElement + "\n" +
						"total internal calls: " + d.totalInternalCalls + "\n" +
						"total calls: " + d.totalCalls
					);
				});

			// draw internal call rectangle over main rectangle?
			rectangleGroupLeft
				.append("rect")
				.attr("width", this.settings.columnwidth - 2 * this.settings.connectorwidth)
				.attr("height", (d, i) => {
					return (d.totalInternalCalls / dataFocus.totalCalls) * columnHeights[0];
				})
				.attr("x", this.settings.connectorwidth)
				.attr("y", (d, i) => {
					let previousTotalCalls = dataFocus.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return ((previousTotalCalls / dataFocus.totalCalls) +
						(d.totalExternalCalls / dataFocus.totalCalls)) *
						columnHeights[0];
				})
				.attr("id", (d, i) => {
					return d.fullname + "-internal";
				})
				.attr("fill", "gray")
				.attr("stroke", "black")
				.append("title")
				.text((d, i) => {
					return "fullname: " + d.fullname + "\n" +
						"total internal calls to this element: " + d.totalInternalCallsToThisElement + "\n" +
						"total internal calls from this element: " + d.totalInternalCallsFromThisElement + "\n" +
						"total internal calls involving this element: " + d.totalInternalCalls + "\n";
				});

			// create group right column
			let rectangleGroupRight = svgContainer
				.selectAll("g.right")
				.data(dataRight.subElements)
				.enter()
				.append("g")
				.attr("class", "right")
				.attr("id", (d, i) => {
					return d.fullname + "-group";
				});

			// create right column
			rectangleGroupRight
				.append("rect")
				.attr("width", this.settings.columnwidth)
				.attr("height", (d, i) => {
					return (d.totalCalls / dataRight.totalCalls) * columnHeights[1];
				})
				.attr("x", this.settings.svgwidth - this.settings.columnwidth)
				.attr("y", (d, i) => {
					let previousTotalCalls = dataRight.subElements.slice(0, i).reduce((total, current) => {
						return total + current.totalCalls;
					}, 0);
					return (previousTotalCalls / dataRight.totalCalls) * columnHeights[1];
				})
				.attr("id", (d, i) => {
					return d.fullname;
				})
				.attr("fill", () => {
					return d3.interpolateCool(Math.random() * 0.5);
				})
				.attr("stroke", "black")
				.each(function(d, i) {
					let self = d3.select(this);
					let title = self.append("title");

					title.text(
						"fullname: " + d.fullname + "\n" +
						"total calls to this element: " + d.totalCallsToThisElement + "\n" +
						"total calls from this element: " + d.totalCallsFromThisElement + "\n" +
						"total calls: " + d.totalCalls
					);
				});

			// draw text if desired
			if (this.settings.showtext) {
				// create left group text
				rectangleGroupLeft
					.append("text")
					.attr("x", 6)
					.attr("y", (d, i) => {
						let previousTotalCalls = dataFocus.subElements.slice(0, i).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);
						return (previousTotalCalls / dataFocus.totalCalls) * columnHeights[0] + 20;
						// maybe add text.bbox.y + 10?
						// cut off name
					})
					.append("tspan")
					.text((d) => {
						return d.name;
					})
					.call(wrap, this.settings.columnwidth, this.settings.connectorwidth);

				// create right group text
				rectangleGroupRight
					.append("text")
					.attr("x", this.settings.svgwidth - this.settings.columnwidth + this.settings.connectorwidth + 6)
					.attr("y", (d, i) => {
						let previousTotalCalls = dataRight.subElements.slice(0, i).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);
						return (previousTotalCalls / dataRight.totalCalls) * columnHeights[1] + 20; // maybe add text.bbox.y + 10?
					})
					.append("tspan")
					.text((d) => {
						return d.name;
					})
					.call(wrap, this.settings.columnwidth, this.settings.connectorwidth);
			}

			// create connectors left
			dataFocus.subElements.forEach((subElement, i) => {
				let connectorGroup = svgContainer
					.select("[id='" + subElement.fullname + "-group']")
					.append("g")
					.attr("id", subElement.fullname + "-connectors")
					.selectAll("rect")
					.data(subElement.externalCalls)
					.enter()
					.append("rect")
					.attr("width", this.settings.connectorwidth)
					.attr("height", (call, j) => {
						let subElementHeight = (subElement.totalCalls / dataFocus.totalCalls) * columnHeights[0];

						return (call.totalCalls / subElement.totalCalls * subElementHeight);
					})
					.attr("x", this.settings.columnwidth - this.settings.connectorwidth)
					.attr("y", (call, j) => {
						let previousDataElementTotal = dataFocus.subElements.slice(0, i).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);

						let previousLocalConnectorTotal = subElement.externalCalls.slice(0, j).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);

						return (previousDataElementTotal + previousLocalConnectorTotal) / dataFocus.totalCalls * columnHeights[0];
					})
					.attr("fill", (call, j) => {
						let targetFullname: string;
						if (call.from === subElement.fullname) {
							targetFullname = call.to;
						} else {
							targetFullname = call.from;
						}

						return d3.select("[id='" + targetFullname + "']").attr("fill");
					})
					.attr("stroke", "black")
					.attr("class", "leftconnector")
					.attr("id", (call, j) => {
						if (call.from === subElement.fullname) {
							return call.from + "-" + call.to;
						} else {
							return call.to + "-" + call.from;
						}
					})
					.each(function(d, k) {
						let self = d3.select(this);
						let title = self.append("title");
						if (d.from === subElement.fullname) {
							title.text(
								"target fullname: " + d.to + "\n" +
								"total calls to target: " + d.totalCalls + "\n"
							);
						} else {
							title.text(
								"target fullname: " + d.from + "\n" +
								"total calls from target: " + d.totalCalls + "\n"
							);
						}
					});
			});

			// create connectors right
			dataRight.subElements.forEach((subElement, i) => {
				let connectorGroup = svgContainer
					.select("[id='" + subElement.fullname + "-group']")
					.append("g")
					.attr("id", subElement.fullname + "-connectors")
					.selectAll("rect")
					.data(subElement.externalCalls)
					.enter()
					.append("rect")
					.attr("width", this.settings.connectorwidth)
					.attr("height", (call, j) => {
						let subElementHeight = (subElement.totalCalls / dataRight.totalCalls) * columnHeights[1];

						return (call.totalCalls / subElement.totalCalls * subElementHeight);
					})
					.attr("x", this.settings.svgwidth - this.settings.columnwidth)
					.attr("y", (call, j) => {
						let previousDataElementTotal = dataRight.subElements.slice(0, i).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);

						let previousLocalConnectorTotal = subElement.externalCalls.slice(0, j).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);

						return (previousDataElementTotal + previousLocalConnectorTotal) / dataRight.totalCalls * columnHeights[1];
					})
					.attr("fill", (call, j) => {
						let targetFullname: string;
						if (call.from === subElement.fullname) {
							targetFullname = call.to;
						} else {
							targetFullname = call.from;
						}

						return d3.select("[id='" + targetFullname + "']").attr("fill");
					})
					.attr("stroke", "black")
					.attr("class", "rightconnector")
					.attr("id", (call, j) => {
						if (call.from === subElement.fullname) {
							return call.from + "-" + call.to;
						} else {
							return call.to + "-" + call.from;
						}
					})
					.each(function(d, k) {
						let self = d3.select(this);
						let title = self.append("title");
						if (d.from === subElement.fullname) {
							title.text(
								"target fullname: " + d.to + "\n" +
								"total calls to target: " + d.totalCalls + "\n"
							);
						} else {
							title.text(
								"target fullname: " + d.from + "\n" +
								"total calls from target: " + d.totalCalls + "\n"
							);
						}
					});
			});

			// create roads group
			svgContainer
				.append("g")
				.attr("id", "roads");

			// create roads
			dataFocus.subElements.forEach((subElement, i) => {
				let roads = d3.select("#roads");
				console.log(subElement.externalCalls);
				subElement.externalCalls.forEach((call, j) => {
					roads
						.append("polygon")
						.attr("points", () => {
							// if true from left to right
							// if false from right to left
							let leftToRight: boolean = dataFocus.subElementFullnames.some((value) => {
								return value === call.from;
							});

							let points: string[] = [];
							if (leftToRight) { // left to right
								let connectorFrom = svgContainer
									.select("[class='leftconnector'][id='" + call.from + "-" + call.to + "']");
								let connectorTo = svgContainer
									.select("[class='rightconnector'][id='" + call.to + "-" + call.from + "']");

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
										+ parseInt(connectorTo.attr("height"))));
								points.push( // bottom left
									(parseInt(connectorFrom.attr("x"))
										+ parseInt(connectorFrom.attr("width")))
									+ ","
									+ (parseInt(connectorFrom.attr("y"))
										+ parseInt(connectorFrom.attr("height"))));
								return points.join(" ");
							} else { // right to left
								let connectorFrom = svgContainer
									.select("[class='rightconnector'][id='" + call.from + "-" + call.to + "']");
								let connectorTo = svgContainer
									.select("[class='leftconnector'][id='" + call.to + "-" + call.from + "']");

								points.push( // top left
									(parseInt(connectorTo.attr("x"))
										+ parseInt(connectorTo.attr("width")))
									+ ","
									+ connectorTo.attr("y"));
								points.push( // top right
									connectorFrom.attr("x")
									+ ","
									+ connectorFrom.attr("y"));
								points.push( // bottom right
									connectorFrom.attr("x")
									+ ","
									+ (parseInt(connectorFrom.attr("y"))
										+ parseInt(connectorFrom.attr("height"))));
								points.push( // bottom left
									(parseInt(connectorTo.attr("x"))
										+ parseInt(connectorTo.attr("width")))
									+ ","
									+ (parseInt(connectorTo.attr("y"))
										+ parseInt(connectorTo.attr("height"))));
								return points.join(" ");
							}
						})
						.attr("id", () => {
							if (call.from === subElement.fullname) {
								return call.from + "-" + call.to;
							} else {
								return call.to + "-" + call.from;
							}
						})
						.attr("fill", () => {
							let colorId: string;
							console.log("from: " + call.from);
							console.log("fullname: " + subElement.fullname);
							if (call.from === subElement.fullname) {
								colorId = call.to;
							} else {
								colorId = call.from;
							}

							return d3.select("rect[id='" + colorId + "']").attr("fill");
						})
						// .attr("stroke", "black")
						.attr("opacity", 0.6)
						.append("title")
						.text(() => {
							return "from: " + call.from + "\n" +
								"to: " + call.to + "\n" +
								"total calls: " + call.totalCalls + "\n";
						});
				});
			});

		}).catch((reason) => {
			console.log(reason);
		});
	}

	public remove(): void {
		let svgContainer = d3
			.select("svg")
			.remove();
	}

	public readsettings(): void {
		// read focus settings
		this.settings.element.type = d3
			.select(".setting#focustype")
			.property("value");

		this.settings.element.fullname = d3
			.select(".setting#focusname")
			.property("value");

		// read runs setting
		{
			let runsSelectElement = d3
				.select(".setting#runs")
				.node() as HTMLSelectElement;

			let runs: string[] = [];
			// tslint:disable-next-line
			for (let i = 0; i < runsSelectElement.selectedOptions.length; i++) {
				runs.push(runsSelectElement.selectedOptions[i].value);
			}

			this.settings.runs = runs;
		}

		// read internals setting
		this.settings.includeinternal = d3.select(".setting#internals").property("checked");

		// read svg height setting
		this.settings.svgheight = parseInt(d3.select(".setting#svgheight").property("value"));

		// read svg width setting
		this.settings.svgwidth = parseInt(d3.select(".setting#svgwidth").property("value"));

		// read columnwidth setting
		this.settings.columnwidth = parseInt(d3.select(".setting#columnwidth").property("value"));

		// read connectorwidth setting
		this.settings.connectorwidth = parseInt(d3.select(".setting#connectorwidth").property("value"));

		// read showconnector setting
		this.settings.showconnector = d3.select(".setting#showconnector").property("checked");

		// read showtext setting
		this.settings.showtext = d3.select(".setting#showtext").property("checked");
	}
}
