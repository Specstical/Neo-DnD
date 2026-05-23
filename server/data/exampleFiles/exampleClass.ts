
export default {
    id:"rogue",
    name: "Rogue",
    description: "Rogues are masters of stealth, deception, and precision strikes. They excel at sneaking, lockpicking, and disarming traps, making them invaluable in exploration and infiltration. With their cunning and agility, rogues can strike from the shadows to deal devastating damage to their foes.",

    hitDie: 8,
    primaryAbility: "dexterity",

    startingEquipment:{

    },

    classFeatures: [
        {
            id: "coreTraits",
            levelRequirement: 1,
            name: "Core Traits",
            description: "Rogues have a set of core traits that define their capabilities and playstyle.",
            
            savingThrowProficiencies: ["dexterity", "intelligence"],
            toolProficiencies: ["thievesTools"],
            weaponProficiencies: ["simpleWeapons", "handCrossbows", "longswords", "rapiers", "shortswords"],
            armorTrainings: ["lightArmor"],

            skillProficienciesChoices: {
                amount: 4,
                options: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleightOfHand", "stealth"]
            }

        },
        {
            id: "expertise",
            levelRequirement: 1,
            name: "Expertise",
            description: "At 1st level, you choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies. At 6th level, you can choose another two proficiencies to gain this benefit from.",
            choices: {
                amount: 2,
                from:"skillProficienciesChoices"
             },
    
        },
        {
            id: "sneakAttack",
            levelRequirement: 1,
            name: "Sneak Attack",
            description: "Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll. The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.",
            
        },
        {
            id: "thievesCant",
            levelRequirement: 1,
            name: "Thieves' Cant",
            description: "During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.",
            
            languageProficiencies: ["thievesCant"],

            languageProficienciesChoices: {
                amount: 1,
                options:["languages"]
             },
        },
        {
            id: "weaponMastery",
            levelRequirement: 3,
            name: "Weapon Mastery",
            description: "At 3rd level, you gain mastery with certain weapons. Choose two weapons from the rogue weapon list. You gain a +1 bonus to attack rolls you make with those weapons. This benefit increases to +2 at 10th level and +3 at 17th level.",
            weaponMasteryChoices: {
                amount: 2,
                options:["weaponProficiencies"]
             },
        },

        
    ]

}