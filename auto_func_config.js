auto_options = {
    resource: {
        wood: {
            incr_priority: {
                priority: 1,
                woodMinRatio: 0.01,
            },
        },
        minerals: {
            incr_priority: {
                priority: 1,
                mineralsMinRatio: 0.01,
            },
        },
        beam: {
            incr_priority: {
                priority: 1,
                woodMinValue: 0.01,
            },
        },
        scaffold: {
            incr_priority: {
                priority: 2,
                woodMinValue: 0.01,
            },
        },
        slab: {
            incr_priority: {
                priority: 1,
                mineralsMinValue: 0.01,
            },
        },
        science: {
            incr_priority: {
                priority: 1,
                scienceMinRatio: 0.01,
            },
        },
        iron: {
            incr_priority: {
                priority: 2,
                ironMinRatio: 0.01,
            },
        },
        plate: {
            incr_priority: {
                priority: 2,
                ironMinValue: 0.01,
            },
        },
        steel: {
            incr_priority: {
                priority: 3,
                ironMinValue: 0.01,
                coalMinValue: 0.01,
            },
        },
        gear: {
            incr_priority: {
                priority: 3,
                ironMinValue: 0.1,
                coalMinValue: 0.1,
            },
        },
        alloy: {
            incr_priority: {
                priority: 5,
                titaniumMinValue: 0.006,
                titaniumMinRatio: 0.006,
            },
        },
        gold: {
            incr_priority: {
                priority: 1,
                upgrades: ['goldOre'],
            },
        },
        coal: {
            incr_priority: {
                priority: 1,
                upgrades: ['deepMining'],
            },
        },
        parchment: {
            incr_priority: {
                priority: 3,
            },
            festivalWillEnd:{
                asShortRes: { //成为短缺资源
                    parchmentValueLe: 2500,
                },
                scope: [1, 50],
            }
        },
        manuscript:{
            incr_priority: {
                priority: 4,
                manuscriptMinRatio: 0.0001,
            },
        },
        compedium:{
            incr_priority: {
                priority: 5,
                manuscriptMinRatio: 0.0001,
            },
        },
        megalith: {
            incr_priority: {
                priority: 6,
                megalithCanCraft: true,
            },
        },
        titanium: {
            incr_priority: {
                priority: 6,
                titaniumMinRatio: 0.0001,
                titaniumCanTrade: true,
            },
        },
        ship: {
            incr_priority: {
                priority: 6,
                starchartMinRatio: 0.01,
            },
        },
        concrate: {
            incr_priority: {
                priority: 6,
                ironMinRatio: 0.01,
            },
        },
        blueprint:{
            incr_priority: {
                priority: 5,
                manuscriptMinRatio: 0.0001,
                blueprintCanCraft: true,
            },
        },
        oil: {
            incr_priority: {
                priority: 6,
                oilMinRatio: 0.15,
            },
        },
        uranium: {
            incr_priority: {
                priority: 7,
                titaniumMinRatio: 2,
                tech: ["orbitalEngineering"],
                upgrades: ['miningDrill', "geodesy"], //不然geologist不产gold
            },
        },
        kerosene: {
            incr_priority: {
                priority: 7,
                keroseneCanCraft: true,
            },
        },
        starchart: {
            incr_priority: {
                priority: 8,
                starchartMinRatio: 0.1,
            },
        },
        unobtainium:{
            incr_priority: {
                priority: 8,
                unobtainiumMinRatio: 0.001,
                tech: ["orbitalEngineering"],
                upgrades: ['miningDrill', "geodesy"],
            },
        },
        thorium: {
            incr_priority: {
                priority: 9,
                unobtainiumMinRatio: 10,
            },
        },
        eludium: {
            incr_priority: {
                priority: 10,
                unobtainiumAvgRatio: {value: 10},
                eludiumCanCraft: true,
            },
        },
        antimatter:{
            incr_priority:{
                priority: 11,
                sunlifterSpaceBldUnlocked: true,
                sunlifterSpaceBldValGe: 30,
                energyAvgValueGe: {value: 10},
            }
        },
    },
    building: {
        groups: this.game.bld.buildingGroups,
        upgrade: {
            field:{
                planet: 'earth',
                valX:{
                    immediately: [{
                        noShortRes: ['catnip', 'wood'],
                    }]
                }
            },
            pasture:{
                planet: 'earth',
                valX:{
                    immediately: [{
                        noShortRes: ['catnip', 'wood'],
                    }, {
                        pastureEarthBldPromoteRes: 'energy',
                        energyEmergency: true,
                        pastureEarthBldIsLimited: false,
                        force_incr_priority: true,
                    }]
                },
                up_stage: {
                    immediately:[{
                        sunlifterSpaceBldUnlocked: true,
                        catnipAvgRatioGe: {value: 2000},
                        energyAvgValueLe: {value: 0},
                    }],
                }
            },
            aqueduct:{
                planet: 'earth',
                valX:{
                    immediately: [{
                        noShortRes: ['minerals'],
                    }, {
                        aqueductEarthBldPromoteRes: 'energy',
                        aqueductEarthBldIsLimited: false,
                        energyEmergency: true,
                        force_incr_priority: true,
                    }]
                },
                up_stage: {
                    immediately:[{
                        catnipAvgRatioGe: {value: 2000},
                        titaniumAvgRatioGe: {value: 10},
                    }],
                }
            },
            library:{
                planet: 'earth',
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood'],
                    }, {
                        scienceMaxValueLe: 500000,
                        antimatterMinValue: 125,
                        aiCoreEarthBldUnlocked: true,
                        force_incr_priority: true,
                    },{
                        allRacesLimitedCulture: true,
                        limitedBldPercentage: 0.15, //所有受资源存储限制的建筑比例
                        force_incr_priority: true,
                    }],
                },
                up_stage: {
                    immediately:[{}],
                }
            },
            lumberMill:{
                planet: 'earth',
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood', 'minerals', 'iron'],
                        woodAvgRatioLe: {value: 1},
                        incr_priority: true, //提升优先级，默认为false
                    }],
                }
            },
            quarry:{
                planet: 'earth',
                valX: {
                    immediately: [{
                        mineralsAvgRatioLe: {value: 1},
                        incr_priority: true, //提升优先级，默认为false
                    }, {
                        coalAvgRatioLe: {value: 1},
                        incr_priority: true, //提升优先级，默认为false
                    }, {
                        uraniumAvgRatioLe: {value: -1},
                        quarryEarthBldPromoteRes: 'uranium',
                        force_incr_priority: true, //提升优先级，默认为false
                    }], //立即升级
                },
            },
            mine:{
                planet: 'earth',
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood'],
                        mineralsAvgRatioLe: {value: 0},
                        incr_priority: true, //提升优先级，默认为false
                    }],
                }
            },
            academy:{
                planet: 'earth',
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood', 'minerals', 'science'],
                    }],
                }
            },
            temple:{
                planet: 'earth',
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['gold', 'iron', 'minerals', 'furs']
                    }],
                }
            },
            biolab:{
                planet: 'earth',
                condition: {
                },
                incr_priority: {
                    titaniumMinRatio: 0.05,
                }
            },
            barn: {
                planet: 'earth',
                valX:{
                    immediately: [{
                        noShortRes: ['wood'],
                        limitedBldPercentage: 0.4, //所有受资源存储限制的建筑比例
                    }]
                }
            },
            warehouse:{
                planet: 'earth',
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood', 'minerals'],
                        limitedBldPercentage: 0.4, //所有受资源存储限制的建筑比例
                    }],
                }
            },
            harbor: {
                planet: 'earth',
                valX:{
                    immediately: [{
                        noShortRes: ['minerals', 'iron'],
                        limitedBldPercentage: 0.2, //所有受资源存储限制的建筑比例
                    }]
                }
            },
            steamworks:{
                planet: 'earth',
                condition: {
                    priority: {
                        srcBuildingNoUpgrade: ['gold'], //所有开销相关资源建筑不允许升级
                    },
                },
                val0:{
                    immediately:[{
                        blueprintMinValue: 1,
                        force_incr_priority: true,
                    }],
                },
                incr_priority: {
                    val0: {
                        blueprintMinValue: 1,
                    }
                },
                on_off: [{
                    toValue: 0,
                    coalIsBaseShortRes: true,
                    coalIsNotWillFull: {value: 0.95},
                }],
            },
            observatory: {
                planet: 'earth',
                valX:{
                    immediately: [{
                        coalIsWillFull: {value: 0.95},
                        observatoryEarthBldValLe: 25,
                        observatoryEarthBldIsLimited: false,
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                }
            },
            smelter:{
                planet: 'earth',
                val0:{
                    immediately: [{
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                },
            },
            calciner:{
                planet: 'earth',
                val0:{
                    immediately: [{
                        titaniumCanTrade: true,
                        calcinerEarthBldUpgradeResEnough: {value: ['blueprint']},
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                },
                valX:{
                    immediately: [{
                        titaniumCanTrade: true,
                        calcinerEarthBldUpgradeResEnough: {value: ['blueprint']},
                        calcinerEarthBldValLe: 5,
                        titaniumTradeValueGe: 5,
                        force_incr_priority: true, //提升优先级，默认为false
                    },{
                        titaniumCanTrade: true,
                        calcinerEarthBldUpgradeResEnough: {value: ['blueprint', 'titanium']},
                        calcinerEarthBldValLe: 10,
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                }
            },
            mint:{
                planet: 'earth',
                condition: {
                    val0: {
                        srcBuildingNoUpgrade: ['gold'], //所有开销相关资源建筑不允许升级
                    },
                },
                val0:{
                    immediately: [{
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                },
            },
            amphitheatre:{
                planet: 'earth',
                val0: {
                    immediately: [{ //立即升级
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                },
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood', 'minerals', 'furs']
                        // happinessLs: 1,
                    }],
                },
                up_stage: {
                    immediately:[{}],
                }
            },
            workshop: {
                planet: 'earth',
                val0: {
                    immediately: [{
                        force_incr_priority: true, //提升优先级，默认为false
                    }], //立即升级
                },
                valX: {
                    immediately: [{ //立即升级
                        noShortRes: ['wood', 'minerals']
                    }],
                }
            },
            tradepost: {
                planet: 'earth',
                val0: {
                    immediately: [{
                        force_incr_priority: true, //提升优先级(如果当前有优先级则无效)，默认为false
                    }], //立即升级
                },
                valX: {
                    immediately: [{
                        noShortRes: ['gold', 'wood', 'minerals']
                    }], //立即升级
                }
            },
            oilWell: {
                planet: 'earth',
                condition: {
                    priority: {
                        srcBuildingNoUpgrade: ['steel'], //所有开销相关资源建筑不允许升级
                    },
                },
                valX: {
                    immediately: [{
                        oilAvgRatioLe: {value: 0.01, count: 30},
                        force_incr_priority: true, //强制提升优先级，立马提升，默认为false
                    },{
                        orbitalLaunchProgramValGe: 1,
                        oilMaxValueLe: 45000,
                        moonMissionProgramUnlocked: true,
                        force_incr_priority: true, //强制提升优先级，立马提升，默认为false
                    },{
                        oilMaxValueLe: 15000,
                        orbitalLaunchProgramUnlocked: true,
                        force_incr_priority: true, //强制提升优先级，立马提升，默认为false
                    },{
                        oilMaxValueLe: 55000,
                        moonOutpostSpaceBldUnlocked: true,
                        force_incr_priority: true, //强制提升优先级，立马提升，默认为false
                    },{
                        moonOutpostSpaceBldValGe: 1,
                        oilMaxValueLe: 70000,
                        moonBaseSpaceBldUnlocked: true,
                        force_incr_priority: true, //强制提升优先级，立马提升，默认为false
                        unobtainiumMinValue: 50,
                    }], //立即升级
                },
            },
            unicornPasture:{
                planet: 'earth',
                valX: {
                    immediately: [{}], //立即升级
                }
            },
            magneto:{
                planet: 'earth',
                valX: {
                    immediately: [{}], //立即升级
                }
            },
            factory:{
                planet: 'earth',
                valX: {
                    immediately: [{
                        titaniumIsShortRes: false,
                        concrateIsShortRes: false,
                    }], //立即升级
                }
            },
            accelerator: {
                planet: 'earth',
                condition: {
                    priority: {
                        srcBuildingNoUpgrade: ['titanium'], //所有开销相关资源建筑不允许升级
                    },
                },
                val0: {
                    immediately: [{
                        tech: ["orbitalEngineering"],
                        upgrades: ['miningDrill'], //不然geologist不产gold
                        titaniumMinRatio: 0.1,
                        uraniumCanTrade: true,
                        force_incr_priority: true, //提升优先级(如果当前有优先级则无效)，默认为false
                    }], //立即升级
                },
                valX: {
                    immediately: [{
                        tech: ["orbitalEngineering"],
                        upgrades: ['miningDrill'],
                        uraniumAvgRatioLe: {value: 0.1},
                        force_incr_priority: true, //提升优先级(如果当前有优先级则无效)，默认为false
                    }, {
                        tech: ["orbitalEngineering"],
                        upgrades: ['miningDrill'],
                        titaniumAvgRatioGe: {value: 1},
                        uraniumAvgValueLe: {value: 11, count: 10}, //该值参考moonOutpost.off.uraniumAvgValueLe
                        force_incr_priority: true, //提升优先级(如果当前有优先级则无效)，默认为false
                    }], //立即升级
                },
            },
            reactor:{
                planet: 'earth',
                condition: {
                    priority: {
                        srcBuildingNoUpgrade: ['plate', 'titanium'], //所有开销相关资源建筑不允许升级
                    },
                },
                val0: {
                    immediately: [{
                        uraniumMinRatio: 0.01,
                        force_incr_priority: true,
                    }], //立即升级
                },
                valX: {
                    immediately: [{
                        uraniumMinRatio: 0.01,
                        uraniumIsShortRes: false,
                    },{
                        titaniumMinValue: 5000,
                        uraniumAvgRatioGe: {value: 0.1},
                        uraniumIsShortRes: false,
                        moonOutpostSpaceOnGe: 1,
                        force_incr_priority: true,
                    }], //立即升级
                }
            },
            chapel:{
                planet: 'earth',
                valX: {
                    immediately: [{
                        parchmentIsShortRes: false,
                        cultureIsShortRes: false,
                    }], //立即升级
                }
            },
            spaceElevator:{
                planet: 'cath',
                valX: {
                    immediately: [{
                        upgrades: ['miningDrill'],
                    }]
                },
            },
            sattelite: {
                planet: 'cath',
                val0: {
                    immediately: [{
                        upgrades: ['miningDrill'],
                        titaniumMinRatio: 0.1,
                        oilMinRatio: 1,
                        starchartMinValue: 325,
                        force_incr_priority: true,
                    }], //立即升级
                },
                valX: {
                    immediately: [{
                        upgrades: ['miningDrill'],
                        starchartIsShortRes: true,
                        titaniumMinRatio: 1,
                        oilMinRatio: 1,
                    }], //立即升级
                },
            },
            moonOutpost:{
                planet: 'cath',
                val0: {
                    immediately: [{
                        upgrades: ['miningDrill'],
                        uraniumMinRatio: 0.001,
                        starchartMinValue: 650,
                        force_incr_priority: true,
                    }], //立即升级
                },
                valX: {
                    immediately: [{
                        upgrades: ['miningDrill'],
                        unobtainiumIsShortRes: true,
                        unobtainiumAvgRatioLe: {value: 0.1},
                        moonOutpostSpaceBldOnGe: 1,
                        force_incr_priority: true,
                    },{
                        upgrades: ['miningDrill'],
                        unobtainiumIsBaseShortRes: true,
                        sunlifterSpaceBldValLe: 30,
                        moonOutpostSpaceBldOnGe: 1,
                    }],
                },
                on_off: [{
                    toValue: 0,
                    uraniumAvgValueLe: {value: 10, count: 10},
                }, {
                    toValue: 0,
                    uraniumIsShortRes: true,
                }]
            },
            moonBase: {
                planet: 'cath',
                val0: {
                    immediately: [{
                        starchartMinValue: 700,
                        force_incr_priority: true,
                    }], //立即升级
                }
            },
            planetCracker:{
                planet: 'dune',
                condition: {
                    val0: {
                        srcBuildingNoUpgrade: ['starchart'], //所有开销相关资源建筑不允许升级
                    },
                },
                valX: {
                    immediately: [{
                        uraniumAvgRatioLe: {value: 0, count: 30},
                        starchartMinRatio: 0.05,
                        planetCrackerSpaceBldUpgradeResEnough: {value: ['starchart']},
                        force_incr_priority: true,
                    }], //立即升级
                }
            },
            containmentChamber: {
                planet: 'helios',
                valX: {
                    immediately: [{
                        containmentChamberSpaceBldUpgradeResEnough: {value:['kerosene']},
                        force_incr_priority: true,
                    }], //立即升级
                },
                on_off: [{
                    interval: -1,
                    seasons: ['Winter'],
                    energyEmergency: true,
                }, {
                    interval: 1,
                    seasons: ['Spring', 'Summer', 'Autumn'],
                    energyEmergency: false,
                }],
            },
            sunlifter: {
                planet: 'helios',
                valX: {
                    immediately: [{
                        sunlifterSpaceBldUpgradeResEnough: {value:["eludium"]},
                        sunlifterSpaceBldValLe: 30,
                        force_incr_priority: true,
                    }, {
                        energyAvgValueLe: {value: 0},
                        energyEmergency: true, //能源告急
                        force_incr_priority: true,
                    }, {
                        antimatterAvgRatioLe: {value: 30},
                        force_incr_priority: true,
                    }], //立即升级
                }
            },
            researchVessel: {
                planet: 'piscine',
                valX: {
                    immediately: [{
                        researchVesselSpaceBldUpgradeResEnough: {value:['starchart', 'titianium']},
                        oilMinRatio: 50,
                        starchartMinRatio: 0.5,
                        starchartAvgRatioLe: {value: 4},
                        force_incr_priority: true,
                    }], //立即升级
                }
            },
            aiCore:{
                planet: 'earth',
                val0: {
                    immediately: [{
                        antimatterMinValue: 125,
                        force_incr_priority: true,
                    }], //立即升级
                }
            }
        },
    },
    craft:{
        strategies:{
            beam: [{name: 'wood', value: 0.1, type: 'percentage'}, {name: 'beam', value: 0.1, type: 'percentage'}],
            scaffold: [{name: 'beam', value: 0.1, type: 'percentage'}, {name: 'wood', value: 0.1, type: 'percentage'},
                {name: 'beam', value: 0.1, type: 'percentage'}, {name: 'scaffold', value: 0.1, type: 'percentage'}],
            slab: [{name: 'slab', value: 0.1, type: 'percentage'}],
            plate: [{name: 'plate', value: 0.1, type: 'percentage'}],
            steel: [{name: 'steel', value: 0.1, type: 'percentage'}],
            gear: [{name: 'steel', value: 0.1, type: 'percentage'}, {name: 'gear', value: 0.1, type: 'percentage'}],
            alloy: [{name: 'steel', value: 0.1, type: 'percentage'}, {name: 'alloy', value: 0.1, type: 'percentage'}],
            ship: [{name: 'plate', value: 0.1, type: 'father'}, {name: 'scaffold', value: 0.1, type: 'father'},
                {name: 'ship', value: 0.1, type: 'percentage'}],
            parchment: [{name: 'parchment', value: 1, type: 'percentage'}],
            manuscript: [{name: 'parchment', value: 1, type: 'percentage'}, {name: 'manuscript', value: 0.1, type: 'percentage'}],
            compedium: [{name: 'parchment', value: 1, type: 'percentage'}, {name: 'manuscript', type: 'father'},
                {name: 'compedium', value: 0.1, type: 'percentage'}],
            blueprint: [{name: 'compedium', type: 'father'}, {name: 'blueprint', value: 0.1, type: 'percentage'}],
            megalith: [{name: 'beam', type: 'father'}, {name: 'slab', type: 'father'},
                {name: 'plate', type: 'father'}, {name: 'megalith', value: 0.1, type: 'percentage'}],
            concrate: [{name: 'slab', type: 'father'}, {name: 'steel', type: 'father'},
                {name: 'concrate', value: 0.1, type: 'percentage'}],
            kerosene: [{name: 'kerosene', value: 0.1, type: 'percentage'}],
            tanker: [{name: 'alloy', value: 0.1, type: 'father'}, {name: 'ship', value: 0.1, type: 'father'},
                {name: 'tanker', value: 0.1, type: 'percentage'}],
            thorium: [{name: 'thorium', value: 0.1, type: 'percentage'}],
            eludium: [{name: 'alloy', value: 0.1, type: 'father'},{name: 'eludium', value: 0.1, type: 'percentage'}],
        },
        resource:{
            catnip: {
                craft_res: ['wood'],
            },
            wood: {
                craft_res: ['beam'],
            },
            beam: {
                timer: {
                    woodIsShortRes: false,
                    cycle_unit_s: 10,
                },
            },
            minerals: {
                craft_res: ['slab'],
            },
            slab:{
                timer: {
                    mineralsIsShortRes: false,
                    cycle_unit_s: 10,
                },
            },
            coal: {
                craft_res: ['steel'],
                craftWhenFull: {
                    value: 0.99,
                    noShortRes: ['iron', 'plate'],
                },
            },
            iron: {
                craft_res: ['steel', 'plate'],
                craftWhenFull: {
                    value: 0.99,
                    noShortRes: ['coal'],
                },
            },
            gear: {
                craft_res: ['gear'],
                timer: {
                    steelIsShortRes: false,
                    steelMinValue: 1000,
                    cycle_unit_s: 60,
                },
            },
            plate: {
                timer: {
                    ironIsShortRes: false,
                    cycle_unit_s: 60,
                },
            },
            science: {
                craft_res: ['blueprint', 'compedium'],
                craftWhenFull: {
                    value: 0.99,
                    noShortRes: ['manuscript'],
                    allRacesLimitedCulture: false,
                },
            },
            culture:{
                craft_res: ['manuscript'],
                craftWhenFull: {
                    value: 0.99,
                    noShortRes: ['parchment'],
                    parchmentMinValue: 5000, //留资源举行节日
                },
            },
            parchment: {
                craft_res: ['parchment'],
                valX: {
                    immediately: [{
                        noShortRes: ['manpower', 'furs'],
                        allRacesLimitedCulture: true,
                    }],
                }
            },
            manuscript: {
                craft_res: ['manuscript'],
                valX: {
                    immediately: [{
                        noShortRes: ['parchment', 'culture'],
                        allRacesLimitedCulture: true,
                    }],
                }
            },
            ship: {
                craft_res: ['ship'],
                condition: {
                    priority: {
                        srcBuildingNoUpgrade: ['plate'], //所有开销相关资源建筑不允许升级
                    },
                },
                val0: {
                    immediately:[{
                        shipCanCraft: true,
                        starchartMinValue: 25,
                        force_incr_priority: true,
                    }],
                },
                valX: {
                    immediately: [{
                        titaniumIsShortRes: true,
                        titaniumCanTrade: true,
                        shipCanCraft: true,
                        starchartMinValue: 1000,
                        moonOutpostSpaceBldUnlocked: false,
                        starchartIsShortRes: false,
                        titaniumTradeValueGe: 5,
                        incr_priority: true,
                    },{
                        titaniumIsShortRes: true,
                        titaniumCanTrade: true,
                        shipCanCraft: true,
                        moonOutpostSpaceBldUpgradeResEnough: {value: ['starchart']},
                        moonOutpostSpaceBldUnlocked: true,
                        starchartIsShortRes: false,
                        titaniumTradeValueGe: 5,
                        incr_priority: true,
                    }],
                },
                immediately: [{
                    titaniumIsShortRes: true,
                    titaniumCanTrade: true,
                    shipCanCraft: true,
                    starchartMinValue: 25,
                    titaniumTradeValueLe: 4,
                    force_incr_priority: true,
                }],
            },
            titanium: {
                craft_res: ['titanium'],
                priorityWhen:{
                    need_resources: [{name: 'slab', value: 50}],
                }
            },
            oil: {
              craft_res: ['kerosene'],
              craftWhenFull: {
                    noShortRes: ['oil'],
                },
            },
            furs:{
                craftWhenRatioLe0: true,
                craft_res: ['parchment'],
                immediately: [{
                    fursIsShortRes: false,
                    fursMinValue: 1000,
                }],
            },
            scaffold:{
                timer: {
                    beamIsShortRes: false,
                    beamMinValue: 1000,
                    cycle_unit_s: 60,
                },
            },
            uranium: {
                craft_res: ['thorium'],
                craftWhenFull: {
                    value: 0.99,
                    noShortRes: ['uranium'],
                },
            },
            thorium: {
                craft_res: ['thorium'],
                timer: {
                    uraniumIsShortRes: false,
                    uraniumMinValue: 1000,
                    cycle_unit_s: 60,
                },
            },
            unobtainium: {
                craft_res: ['eludium'],
                timer: {
                    unobtainiumIsShortRes: false,
                    unobtainiumMinValue: 1000,
                    cycle_unit_s: 60,
                },
            },
            tanker: {
                craft_res: ['tanker'],
                valX: {
                    immediately: [{
                        tankerValueLe: 50,
                        oilIsWillFull: {value: 0.90},
                    }]
                },
            },
            concrate: {
                timer: {
                    steelIsShortRes: false,
                    steelMinValue: 1000,
                    slabIsShortRes: false,
                    slabMinValue: 1000,
                    cycle_unit_s: 60,
                },
            }
        },
    },
    kittens: {
        jobs: {
            woodcutter: {
                default_value: 1,
                resources:{
                    wood: {
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 0, count: 10},
                        reduceWhenFull: {value: 0.95},
                    },
                },
            },
            miner: {
                default_value: 1,
                resources:{
                    minerals: {
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 5000, count: 10},
                        reduceWhenFull: {value: 0.95}
                    },
                }
            },
            farmer: {
                default_value: 1,
                resources:{
                    catnip: {
                        ratioNoLe: {value: 0, count: 10},
                        valueNoLe: {value: 0, count: 10},
                        reduceWhenFull: {value: 0.95}
                    },
                }
            },
            scholar: {
                default_value: 1,
                resources:{
                    science: {
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 0, count: 10},
                        reduceWhenFull: {value: 0.95}
                    },
                }
            },
            hunter: {
                default_value: 1,
                resources:{
                    manpower: {
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 10, count: 10},
                        reduceWhenFull: {value: 0.95}
                    },
                    furs: {
                        isShortRes: true,
                    },
                    ivory: {
                        isShortRes: true,
                    }
                },
                immediately: [{
                        tradeFrequently: {value: true},
                        manpowerAvgRatioLe: {value: 0}
                    },{
                        tradeFrequently: {value: true},
                        goldIsAvgWillFull: {value: 0.95, count: 10},
                        manpowerIsAvgWillEmpty: {value: 0.1, count: 10},
                    },{
                        tradeFrequently: {value: true},
                        fromJob: 'woodcutter',
                        manpowerAvgValueLe: {value: 100},
                    },{
                        tradeFrequently: {value: true},
                        fromJob: 'woodcutter',
                        woodAvgRatioGe: {value: 10 * 1000},
                        goldIsAvgWillFull: {value: 0.15, count: 10},
                    },{
                        tradeFrequently: {value: true},
                        fromJob: 'miner',
                        manpowerAvgValueLe: {value: 100},
                    },{
                        tradeFrequently: {value: true},
                        fromJob: 'miner',
                        mineralsAvgRatioGe: {value: 10 * 1000},
                        goldIsAvgWillFull: {value: 0.15, count: 10},
                    }
                ],
            },
            geologist: {
                default_value: 1,
                resources:{
                    coal: {
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 0, count: 10},
                        reduceWhenFull: {value: 0.95}
                    },
                    gold: {
                        effect: false, //代码中会实时计算
                        avgRatioLe: {value: 0.1, count: 10},
                        avgValueLe: {value: 15, count: 10},
                        reduceWhenFull: {value: 0.95},
                        increaseWhenEmpty: {value: 0.1}
                    },
                },
                immediately: [{
                    tradeFrequently: {value: true},
                    isGeologistProduceGold: true,
                    goldAvgRatioLe: {value: 0},
                },{
                    tradeFrequently: {value: true},
                    isGeologistProduceGold: true,
                    manpowerIsAvgWillFull: {value: 0.95},
                    goldIsAvgWillEmpty: {value: 0.1, count: 10},
                }],
            },
            priest: {
                default_value: 1,
                resources:{
                    faith: {
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 0, count: 10},
                        reduceWhenFull: {value: 0.95}
                    },
                }
            },
            engineer:{
                default_value: 1,
                resources:{}
            }
        }
    },
    trade: {
        tradeRes: {
            titanium: [{}], coal: [{}], oil: [{}], iron: [{}],
            steel: [{
                goldMinValue: 'max/2', //总容量的1/2
            },{
                coalIsWillFull: {value: 0.95},
                ironIsNotWillFull: {value: 0.95},
                srcRes: 'iron',
            },{
                coalIsNotWillFull: {value: 0.95},
                ironIsWillFull: {value: 0.95},
                srcRes: 'coal',
            }],
            concrate: [{}],
            uranium: [{
                titaniumValueGe: 1000,
                titaniumIsShortRes: false,
            }, {
                titaniumIsShortRes: false,
                titaniumValueLe: 250,
                srcRes: 'titanium',
            }],
            plate: [{
                srcRes: 'iron', //实际购买的资源
            }],
            alloy: [{
                srcRes: 'titanium', //实际购买的资源
            }],
        },
        timer: {cycle_unit_s: 60},
        races: {
            dragons: {
                immediately: [{
                    titaniumIsWillFull: {value: 0.99},
                }],
            }
        }
    }
}