
export default {
    name: "Aria Swiftblade",
    userId: "user123",

    level: 5,
    experience: 6500,

    class: "rouge",
    subclass: "assassin",
    classChoices: {
        coreTraits:{
            skillProficienciesChoices:{
                choice1:{
                    choiceType:"proficiency",
                    choice:"stealth"
                },
                choice2:{
                    choiceType:"proficiency",
                    choice:"acrobatics"
                },
                choice3:{
                    choiceType:"proficiency",
                    choice:"deception"
                },
                choice4:{
                    choiceType:"proficiency",
                    choice:"sleightOfHand"
                }
            }
        },
        expertise:{
            choice1:{
                choiceType:"expertise",
                choice:"stealth"
            },
            choice2:{
                choiceType:"expertise",
                choice:"deception"
            }
        },
        thievesCant:{
                choiceType:"language",
                choice:"orc"
        },
        weaponMastery:{
                choice1:{
                    choiceType:"weaponMastery",
                    choice:"shortsword"
                },
                choice2:{
                    choiceType:"weaponMastery",
                    choice:"handCrossbow"
                }
        }
    },




    race: "Elf",


    stats: {
        strength: 10,
        dexterity: 18,
        constitution: 12,
        intelligence: 14,
        wisdom: 13,
        charisma: 11
    },
    inventory: {
        gold: 150,
        items: [
            {
                id: "shortSword1",
                baseItem: "shortSword",
                name: "Short Sword of Swiftness",
                isModified: true,
                quantity: 1,
            }
        ]
            
    },
    activeEffects: [
        {      
            id: "haste",
            handlerType: "haste",
            name: "Haste",
        }
    ]
}