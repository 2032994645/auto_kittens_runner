auto_options = {
    resource: {
        wood: {              //未配置资源不会成为短缺资源
            incr_priority: { //资源能提升优先级成为短缺资源的条件，通过short_resource()查下，会在页面左上角显示
                priority: 1, //资源提升的先后顺序
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
                planet: 'earth', //所属星球
                valX:{ //当前建筑的val值，即级别，valX代表所有级别，可以随意配置为val0，val1...
                    immediately: [{
                        noShortRes: ['catnip', 'wood'],
                    }]
                }
            },
            pasture:{
                planet: 'earth',
                valX:{
                    immediately: [{   //immediately,同个大括号内的值为与关系，多个大括号之间为或关系，蛮兔条件则立即升级
                        noShortRes: ['catnip', 'wood'],
                    }, {
                        pastureEarthBldPromoteRes: 'energy', //建筑是否促进资源
                        energyEmergency: true,  //是否能源短缺，冬天会少产生能源
                        pastureEarthBldIsLimited: false, //升级是否因为存储空间导致无法升级，容量不足导致无法升级
                        force_incr_priority: true,  //达到条件则立即提升优先级
                    }]
                },
                up_stage: {
                    immediately:[{
                        sunlifterSpaceBldUnlocked: true, //建筑是否可见
                        catnipAvgRatioGe: {value: 2000}, //平均ratio是否大于某个值，还有count参数，默认为30，等同{value: 2000, count: 30}
                        energyAvgValueLe: {value: 0}, //平均持有量小于等于，还有count参数，默认为30
                    }],
                }
            },
            aqueduct:{
                planet: 'earth',
                valX:{
                    immediately: [{
                        noShortRes: ['minerals'], //所配置资源不是当前ShortRes
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
                        scienceMaxValueLe: 500000, //最大容量小于等与某个值
                        antimatterMinValue: 125, //最小拥有量
                        aiCoreEarthBldUnlocked: true,
                        force_incr_priority: true,
                    },{
                        allRacesLimitedCulture: true,  //所有trade中的races都无法升级，无法embassy
                        limitedBldPercentage: 0.15, //所有受资源存储限制的建筑比例
                        force_incr_priority: true,
                    }],
                },
                up_stage: {
                    immediately:[{}], //空时，立即可以升级
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
                        mineralsAvgRatioLe: {value: 1}, //平均速率小于等于某个值，系统会每秒自动采集相关数据，还有count参数，默认为30
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
                on_off: [{    //建筑允许手动跳转on的级别，与immediately一样
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
                        titaniumCanTrade: true, //资源在trade中是否可以购买
                        calcinerEarthBldUpgradeResEnough: {value: ['blueprint']}, //对应建筑的升级所需资源是否已经准备好
                        force_incr_priority: true, //提升优先级，默认为false
                    }],
                },
                valX:{
                    immediately: [{
                        titaniumCanTrade: true,
                        calcinerEarthBldUpgradeResEnough: {value: ['blueprint']},
                        calcinerEarthBldValLe: 5,
                        titaniumTradeValueGe: 5, //在trade中能购买到的的资源大于等于某个值
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
                        // happinessLs: 1,  //幸福度小于某个值，1为100%
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
                        orbitalLaunchProgramValGe: 1, //space中program的登记是否大于等于某个值
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
                        moonOutpostSpaceOnGe: 1, //建筑打开的on是否大于等于某个值，比如建筑显示 0/10, 则表示级别为10，打开为0
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
                        upgrades: ['miningDrill'], //workshop中的升级项是否已经研究
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
                    interval: -1, //满足条件后on调整的大小， 当前 on + interval
                    seasons: ['Winter'], //当前季节是否满足
                    energyEmergency: true,
                }, {
                    interval: 1, //满足条件后on调整的大小， 当前 on + interval
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
        strategies:{  //craft策略，type为father时，会向上找对应的策略craft，father时，value无效
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
                craft_res: ['wood'], //craft目标资源，未配置时为本身，比如本条如果未配置，则默认为catnip
            },
            wood: {
                craft_res: ['beam'],
            },
            beam: {
                timer: {  //定时craft
                    woodIsShortRes: false,
                    cycle_unit_s: 10,  //周期
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
                craftWhenFull: {    //当资源满时，里面是full条件
                    value: 0.99,   //99% 当前值/max
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
                        shipCanCraft: true, //在workshop中是否能craft，因为资源是逐步解锁的，有时候需要等待资源解锁
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
                priorityWhen:{  //当前short_resource资源有titanium时
                    need_resources: [{name: 'slab', value: 50}], //需要保持slab有50个
                }
            },
            oil: {
              craft_res: ['kerosene'],
              craftWhenFull: {
                    noShortRes: ['oil'],
                },
            },
            furs:{
                craftWhenRatioLe0: true,  //当前资源的ratio是否小于0，本条配置的意思是：当furs的ratio小于等于0时，理解craft目标craft_res
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
                default_value: 1, //最少kittens保持数量
                resources:{
                    wood: {  //job生产的资源，下面条件满足时，需要加kittens
                        avgRatioLe: {value: 0, count: 10},
                        avgValueLe: {value: 0, count: 10},
                        reduceWhenFull: {value: 0.95}, //快满时减kittens
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
                        tradeFrequently: {value: true}, //是否交易频繁，某些资源主要来源靠trade，频繁发生购买时触发
                        manpowerAvgRatioLe: {value: 0}
                    },{
                        tradeFrequently: {value: true},
                        goldIsAvgWillFull: {value: 0.95, count: 10},
                        manpowerIsAvgWillEmpty: {value: 0.1, count: 10},
                    },{
                        tradeFrequently: {value: true},
                        fromJob: 'woodcutter',   //从woodcutter调整为当前工作(hunter)，每次1个
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
                    isGeologistProduceGold: true,  //geologist是否会生产gold，geologist开始默认不生产gold，需要完成某些研究
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
        tradeRes: { //允许交易的资源
            titanium: [{}], coal: [{}], oil: [{}], iron: [{}],
            steel: [{
                goldMinValue: 'max/2', //总容量的1/2，也可以直接配置具体数值
            },{
                coalIsWillFull: {value: 0.95},
                ironIsNotWillFull: {value: 0.95},
                srcRes: 'iron', //实际需要购买的资源，满足条件时，购买的是iron而不是steel
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
        timer: {cycle_unit_s: 60}, //定时随机购买
        races: {
            dragons: {
                immediately: [{
                    titaniumIsWillFull: {value: 0.99}, //当titanium快满时，触发dragons购买
                }],
            }
        }
    }
}