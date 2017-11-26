import * as d3 from "d3";
import { AggregateCall, ColumnData, SubElement } from "./../model/ColumnData";
import { Neo4jDataModel } from "./../model/neo4j/Neo4jDataModel";
import { View } from "./View";

export class TriView implements View {
	public dataModel = new Neo4jDataModel();

	public settings: {
		elements: Array<{
			type: string,
			fullname: string
		}>,
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
		elements: [],
		runs: [],
		includeinternal: undefined,
		// graphics settings
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

			// render element selection setting
			settingsdiv
				.append("p")
					.html("Three elements for columns <br/> <i>code can handle more columns, just the settings not yet</i> <br/>")
					.call((selection) => {

						// element 0
						selection
							.append("select")
								.attr("class", "setting")
								.attr("id", "elementtype0")
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
										.select(".setting#elementtype0").property("value");
									this.dataModel.getFocusFullnames(typesetting)
									.then((value) => {
										// no idea why i can't get d3 exit().remove() working, but for now this just works
										d3
											.select(".setting#elementname0")
											.selectAll("option")
											.remove();

										let enterselection = d3
											.select(".setting#elementname0")
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
												.select(".setting#elementname0")
												.select("option[value=\"0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4.93e27f6facd98d345dd426664c9808cfa65b150d6fdb4018ccc9c3877fe4148e.605d7ae0d6648bf1337c68398101b43d6b70d8112b412f2a7ce83d40440e4766.1517a848a355d72b7d2138c198d6729a68e01e6f794acb0cb50a6b7741fb7e08\"]")
												.property("selected", true);
										}
									})
									.catch((reason) => {
										console.log(reason);
									});
								});

						selection
							.append("br");

						selection
							.append("select")
								.attr("class", "setting")
								.attr("id", "elementname0")
								.attr("style", "max-width: 200px");

						selection
							.append("br");

						// element 1
						selection
						.append("select")
							.attr("class", "setting")
							.attr("id", "elementtype1")
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
									.select(".setting#elementtype1").property("value");
								this.dataModel.getFocusFullnames(typesetting)
								.then((value) => {
									// no idea why i can't get d3 exit().remove() working, but for now this just works
									d3
										.select(".setting#elementname1")
										.selectAll("option")
										.remove();

									let enterselection = d3
										.select(".setting#elementname1")
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
											.select(".setting#elementname1")
											.select("option[value=\"0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4.08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca.dfe1d833fd784cae1a235143479a591c9f1b49eaf79e9b1b562ec1c61964e655.f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d32e9efd3d\"]")
											.property("selected", true);
									}
								})
								.catch((reason) => {
									console.log(reason);
								});
							});

						selection
							.append("br");

						selection
							.append("select")
								.attr("class", "setting")
								.attr("id", "elementname1")
								.attr("style", "max-width: 200px");

						selection
							.append("br");

						// element 2
						selection
						.append("select")
							.attr("class", "setting")
							.attr("id", "elementtype2")
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
									.select(".setting#elementtype2").property("value");
								this.dataModel.getFocusFullnames(typesetting)
								.then((value) => {
									// no idea why i can't get d3 exit().remove() working, but for now this just works
									d3
										.select(".setting#elementname2")
										.selectAll("option")
										.remove();

									let enterselection = d3
										.select(".setting#elementname2")
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
											.select(".setting#elementname2")
											.select("option[value=\"0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4.143f28ef35cc31a1ef82d60187442693e2c9cd9f89945ef972b4faf03e207613.aafeaf46ffb9d179caad3751048e8164a81c0477c3200f70f7d9eaf2f47ec701\"]")
											.property("selected", true);
									}
								})
								.catch((reason) => {
									console.log(reason);
								});
							});

						selection
							.append("br");

						selection
							.append("select")
								.attr("class", "setting")
								.attr("id", "elementname2")
								.attr("style", "max-width: 200px");
					});

			let selecttype0 = d3.select(".setting#elementtype0").node() as HTMLSelectElement;
			selecttype0.dispatchEvent(new Event("change"));
			let selecttype1 = d3.select(".setting#elementtype1").node() as HTMLSelectElement;
			selecttype1.dispatchEvent(new Event("change"));
			let selecttype2 = d3.select(".setting#elementtype2").node() as HTMLSelectElement;
			selecttype2.dispatchEvent(new Event("change"));

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
					.html("Show text <br/> <i>Nonfunctional switch</i> <br/>")
					.append("label")
						.attr("class", "switch")
						.call((switchselection) => {
							switchselection
								.append("input")
									.attr("type", "checkbox")
									.attr("class", "setting")
									.attr("id", "showtext")
									.property("checked", false);
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

		// unused at the moment
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

		let promises: Array<Promise<ColumnData>> = [];

		for (let element of this.settings.elements) {
			promises.push(this.dataModel.getColumnData(
				element.type,
				element.fullname,
				this.settings.runs
			));
		}

		Promise.all(promises).then((data) => {
			console.log(data);

			let numberOfColumns = this.settings.elements.length;
			let roadWidth = (this.settings.svgwidth - (numberOfColumns * this.settings.columnwidth)) / (numberOfColumns - 1);
			let columnHeights: number[] = [];
			let maxTotalCalls = Math.max(
				...data.map((value) => {
					return value.totalCalls;
				})
			);

			// create svg tag
			let svgContainer = d3
				.select("div#svg")
				.append("svg")
				.attr("width", this.settings.svgwidth)
				.attr("height", this.settings.svgheight);

			let roads = svgContainer
				.append("g")
				.attr("id", "roads");

			data.forEach((columnData, columnIndex) => {
				// set the height for this column
				columnHeights[columnIndex] = (columnData.totalCalls / maxTotalCalls) * this.settings.svgheight;

				// remove empty subElements
				columnData.subElements = columnData.subElements.filter((subElement) => {
					return subElement.totalCalls > 0;
				});

				// draw column
				// create column group
				let columnGroup = svgContainer
					.selectAll("g.column" + columnIndex)
					.data(columnData.subElements)
					.enter()
					.append("g")
					.attr("class", "column" + columnIndex)
					.attr("id", (d, i) => {
						return d.fullname; // maybe remove group, do i need it for svg?
					});

				// draw main column
				columnGroup
					.append("rect")
					.attr("width", this.settings.columnwidth)
					.attr("height", (d, i) => {
						return (d.totalCalls / columnData.totalCalls) * columnHeights[columnIndex];
					})
					.attr("x", () => {
						return columnIndex * (this.settings.columnwidth + roadWidth);
					})
					.attr("y", (d, i) => {
						let previousTotalCalls = columnData.subElements.slice(0, i).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);
						return (previousTotalCalls / columnData.totalCalls) * columnHeights[columnIndex];
					})
					.attr("id", (d, i) => {
						return d.fullname;
					})
					.attr("fill", () => {
						return d3.interpolateCool(Math.random() * (1 / numberOfColumns) + (columnIndex / numberOfColumns));
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

				// draw internal calls gray block
				columnGroup
					.append("rect")
					.attr("width", this.settings.columnwidth - 2 * this.settings.connectorwidth)
					.attr("height", (d, i) => {
						return (d.totalInternalCalls / columnData.totalCalls) * columnHeights[columnIndex];
					})
					.attr("x", () => {
						return columnIndex * (this.settings.columnwidth + roadWidth) + this.settings.connectorwidth;
					})
					.attr("y", (d, i) => {
						let previousTotalCalls = columnData.subElements.slice(0, i).reduce((total, current) => {
							return total + current.totalCalls;
						}, 0);
						return ((previousTotalCalls / columnData.totalCalls) +
							(d.totalExternalCalls / columnData.totalCalls)) *
							columnHeights[columnIndex];
					})
					.attr("id", (d, i) => {
						return d.fullname + "-internal";
					})
					.attr("fill", "gray")
					.attr("stroke", "black")
					.attr("opacity", 0.6)
					.append("title")
					.text((d, i) => {
						return "fullname: " + d.fullname + "\n" +
							"total internal calls to this element: " + d.totalInternalCallsToThisElement + "\n" +
							"total internal calls from this element: " + d.totalInternalCallsFromThisElement + "\n" +
							"total internal calls involving this element: " + d.totalInternalCalls + "\n";
					});
			});

			data.forEach((columnData, columnIndex) => {
				// set the height for this column
				columnHeights[columnIndex] = (columnData.totalCalls / maxTotalCalls) * this.settings.svgheight;

				// draw connectors
				columnData.subElements.forEach((subElement, i) => {
					if (columnIndex !== numberOfColumns - 1) {
						// draw rightside connectors
						svgContainer
							.select("g[class='column" + columnIndex + "'][id='" + subElement.fullname + "']")
							.selectAll("rect.connector")
							.data(subElement.externalCalls.filter((value) => {
								return data[columnIndex + 1].subElementFullnames.some((value2) => {
									return value.from === value2 || value.to === value2;
								});
							})) // filter only rightside calls
							.enter()
							.append("rect")
							.attr("width", this.settings.connectorwidth)
							.attr("height", (call, j) => {
								let subElementHeight = (subElement.totalCalls / columnData.totalCalls) * columnHeights[columnIndex];

								return (call.totalCalls / subElement.totalCalls * subElementHeight);
							})
							.attr("x", () => {
								return columnIndex * (this.settings.columnwidth + roadWidth) + (this.settings.columnwidth - this.settings.connectorwidth);
							})
							.attr("y", (call, j) => {
								let previousDataElementTotal = columnData.subElements.slice(0, i).reduce((total, current) => {
									return total + current.totalCalls;
								}, 0);

								let previousLocalConnectorTotal = subElement.externalCalls.slice(0, j).reduce((total, current) => {
									return total + current.totalCalls;
								}, 0);

								return (previousDataElementTotal + previousLocalConnectorTotal) / columnData.totalCalls * columnHeights[columnIndex];
							})
							.attr("fill", (call, j) => {
								let targetFullname: string;
								if (call.from === subElement.fullname) {
									targetFullname = call.to;
								} else {
									targetFullname = call.from;
								}

								return d3.select("rect[id='" + targetFullname + "']").attr("fill");
							})
							.attr("stroke", "black")
							.attr("class", "connector")
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
					}
					if (columnIndex !== 0) {
						if (subElement.fullname === "0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4.08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca.dfe1d833fd784cae1a235143479a591c9f1b49eaf79e9b1b562ec1c61964e655.f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d32e9efd3d.31a64c71fc202d09d0575a8b3e5e088701033c298e670562e1562e1e3d186bee") {
							console.log(data[columnIndex - 1].subElementFullnames);
							console.log(subElement.externalCalls);
						}
						// draw leftside connectors
						svgContainer
							.select("g[class='column" + columnIndex + "'][id='" + subElement.fullname + "']")
							.selectAll("rect.connector")
							.data(subElement.externalCalls.filter((value) => {
								return data[columnIndex - 1].subElementFullnames.findIndex((value2) => {
									return value.from === value2 || value.to === value2;
								}) > -1;
							})) // filter only leftside calls
							.enter()
							.append("rect")
							.attr("width", this.settings.connectorwidth)
							.attr("height", (call, j) => {
								let subElementHeight = (subElement.totalCalls / columnData.totalCalls) * columnHeights[columnIndex];

								return (call.totalCalls / subElement.totalCalls * subElementHeight);
							})
							.attr("x", () => {
								return columnIndex * (this.settings.columnwidth + roadWidth);
							})
							.attr("y", (call, j) => {
								let previousDataElementTotal = columnData.subElements.slice(0, i).reduce((total, current) => {
									return total + current.totalCalls;
								}, 0);

								let previousLocalConnectorTotal = subElement.externalCalls.slice(0, j).reduce((total, current) => {
									return total + current.totalCalls;
								}, 0);

								return (previousDataElementTotal + previousLocalConnectorTotal) / columnData.totalCalls * columnHeights[columnIndex];
							})
							.attr("fill", (call, j) => {
								let targetFullname: string;
								if (call.from === subElement.fullname) {
									targetFullname = call.to;
								} else {
									targetFullname = call.from;
								}

								return d3.select("rect[id='" + targetFullname + "']").attr("fill");
							})
							.attr("stroke", "black")
							.attr("class", "connector")
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
					}
				});
			});

			// draw roads
			data.forEach((columnData, columnIndex) => {
				// set the height for this column
				columnHeights[columnIndex] = (columnData.totalCalls / maxTotalCalls) * this.settings.svgheight;

				columnData.subElements.forEach((subElement, subElementIndex) => {
					if (columnIndex !== numberOfColumns - 1) {
						// draw roads to right
						// first filter all calls from this
						let calls = subElement.externalCalls.filter((call) => {
							return call.from === subElement.fullname;
						});

						// filter calls to things that exist in the next column (so go to the right)
						calls = calls.filter((call) => {
							return data[columnIndex + 1].subElementFullnames.some((value) => {
								return call.to === value;
							});
						});

						calls.forEach((call, callIndex) => {
							roads
								.append("polygon")
								.attr("points", () => {
									let points: string[] = [];

									let connectorFrom = svgContainer
										.select(".connector[id=\"" + call.from + "-" + call.to + "\"]");
									let connectorTo = svgContainer
										.select(".connector[id=\"" + call.to + "-" + call.from + "\"]");

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
								})
								.attr("id", call.from + "-" + call.to)
								.attr("fill", d3.select("rect[id=\"" + subElement.fullname + "\"]").attr("fill"))
								// .attr("stroke", "black")
								.attr("opacity", 0.6)
								.append("title")
									.text(() => {
										return "from: " + call.from + "\n" +
											"to: " + call.to + "\n" +
											"total calls: " + call.totalCalls + "\n";
									});
						});
					}
					if (columnIndex !== 0) {
						// draw roads to left
						// first filter all calls from this
						let calls = subElement.externalCalls.filter((call) => {
							return call.from === subElement.fullname;
						});

						// filter calls to things that exist in the previous column (so go left)
						calls = calls.filter((call) => {
							return data[columnIndex - 1].subElementFullnames.some((value) => {
								return call.to === value;
							});
						});

						calls.forEach((call, callIndex) => {
							roads
								.append("polygon")
								.attr("points", () => {
									let points: string[] = [];

									let connectorFrom = svgContainer
										.select(".connector[id=\"" + call.from + "-" + call.to + "\"]");
									let connectorTo = svgContainer
										.select(".connector[id=\"" + call.to + "-" + call.from + "\"]");

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
								})
								.attr("id", call.from + "-" + call.to)
								.attr("fill", d3.select("rect[id=\"" + subElement.fullname + "\"]").attr("fill"))
								// .attr("stroke", "black")
								.attr("opacity", 0.6)
								.append("title")
									.text(() => {
										return "from: " + call.from + "\n" +
											"to: " + call.to + "\n" +
											"total calls: " + call.totalCalls + "\n";
									});
						});
					}
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
		// read element selection settings
		{
			let elements: Array<{type: string, fullname: string}> = [];

			elements.push({
				type: d3.select(".setting#elementtype0").property("value"),
				fullname: d3.select(".setting#elementname0").property("value")
			});

			elements.push({
				type: d3.select(".setting#elementtype1").property("value"),
				fullname: d3.select(".setting#elementname1").property("value")
			});

			elements.push({
				type: d3.select(".setting#elementtype2").property("value"),
				fullname: d3.select(".setting#elementname2").property("value")
			});

			this.settings.elements = elements;
		}

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
