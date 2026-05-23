/**
 * Base Effect Handlers Registry
 * 
 * Defines all available effect types and their handlers.
 * Each handler specifies:
 * - Event hooks (onApply, onRemove, onTick, etc)
 * - Parameter schema for validation
 * - Execution logic
 */

export interface EffectHandler {
  id: string;
  name: string;
  description: string;
  parameterSchema: Record<string, any>;
  onApply?: (target: any, effect: any) => void;
  onRemove?: (target: any, effect: any) => void;
  onTick?: (target: any, effect: any) => void;
  onDamageReceived?: (target: any, effect: any, context: any) => void;
  onDealDamage?: (target: any, effect: any, context: any) => void;
  onAttackRoll?: (target: any, effect: any, context: any) => void;
  onSavingThrow?: (target: any, effect: any, context: any) => void;
  validate?: (parameters: any) => boolean;
}

// ============================================================================
// DAMAGE & PROTECTION EFFECTS
// ============================================================================

export const damageBonus: EffectHandler = {
  id: 'damageBonus',
  name: 'Damage Bonus',
  description: 'Increases damage dealt by a specific amount',
  parameterSchema: {
    amount: { type: 'number', min: -50, max: 50, required: true },
    damageType: { type: 'string', enum: ['fire', 'cold', 'lightning', 'acid', 'poison', 'psychic', 'radiant', 'necrotic', 'force', 'all'], default: 'all' }
  },
  onDealDamage: (target, effect, context) => {
    if (effect.parameters.damageType === 'all' || context.damageType === effect.parameters.damageType) {
      context.totalDamage += effect.parameters.amount;
    }
  }
};

export const damageResistance: EffectHandler = {
  id: 'damageResistance',
  name: 'Damage Resistance',
  description: 'Reduces incoming damage by a percentage',
  parameterSchema: {
    percent: { type: 'number', min: 0, max: 100, required: true },
    damageType: { type: 'string', enum: ['fire', 'cold', 'lightning', 'acid', 'poison', 'psychic', 'radiant', 'necrotic', 'force', 'bludgeoning', 'piercing', 'slashing', 'all'], default: 'all' }
  },
  onDamageReceived: (target, effect, context) => {
    if (effect.parameters.damageType === 'all' || context.damageType === effect.parameters.damageType) {
      context.totalDamage *= (1 - effect.parameters.percent / 100);
    }
  }
};

export const damageImmunity: EffectHandler = {
  id: 'damageImmunity',
  name: 'Damage Immunity',
  description: 'Takes no damage from a specific type',
  parameterSchema: {
    damageType: { type: 'string', enum: ['fire', 'cold', 'lightning', 'acid', 'poison', 'psychic', 'radiant', 'necrotic', 'force', 'bludgeoning', 'piercing', 'slashing'], required: true }
  },
  onDamageReceived: (target, effect, context) => {
    if (context.damageType === effect.parameters.damageType) {
      context.totalDamage = 0;
    }
  }
};

// ============================================================================
// ABILITY & SKILL EFFECTS
// ============================================================================

export const abilityBonus: EffectHandler = {
  id: 'abilityBonus',
  name: 'Ability Bonus',
  description: 'Increases an ability score',
  parameterSchema: {
    ability: { type: 'string', enum: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'], required: true },
    amount: { type: 'number', min: -20, max: 20, required: true }
  },
  onApply: (target, effect) => {
    const ability = effect.parameters.ability;
    target.stats[ability] = (target.stats[ability] || 0) + effect.parameters.amount;
  },
  onRemove: (target, effect) => {
    const ability = effect.parameters.ability;
    target.stats[ability] = (target.stats[ability] || 0) - effect.parameters.amount;
  }
};

export const skillBonus: EffectHandler = {
  id: 'skillBonus',
  name: 'Skill Bonus',
  description: 'Increases a skill modifier',
  parameterSchema: {
    skill: { type: 'string', enum: ['acrobatics', 'animal_handling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleight_of_hand', 'stealth', 'survival'], required: true },
    amount: { type: 'number', min: -10, max: 10, required: true }
  },
  onApply: (target, effect) => {
    target.skills = target.skills || {};
    target.skills[effect.parameters.skill] = (target.skills[effect.parameters.skill] || 0) + effect.parameters.amount;
  },
  onRemove: (target, effect) => {
    target.skills = target.skills || {};
    target.skills[effect.parameters.skill] = (target.skills[effect.parameters.skill] || 0) - effect.parameters.amount;
  }
};

// ============================================================================
// ARMOR & DEFENSE EFFECTS
// ============================================================================

export const acBonus: EffectHandler = {
  id: 'acBonus',
  name: 'AC Bonus',
  description: 'Increases armor class',
  parameterSchema: {
    amount: { type: 'number', min: -5, max: 10, required: true }
  },
  onApply: (target, effect) => {
    target.armorClass = (target.armorClass || 10) + effect.parameters.amount;
  },
  onRemove: (target, effect) => {
    target.armorClass = (target.armorClass || 10) - effect.parameters.amount;
  }
};

export const shieldBonus: EffectHandler = {
  id: 'shieldBonus',
  name: 'Shield Bonus',
  description: 'Grants temporary hit points or shield value',
  parameterSchema: {
    amount: { type: 'number', min: 1, max: 100, required: true },
    type: { type: 'string', enum: ['tempHP', 'shield'], default: 'tempHP' }
  },
  onApply: (target, effect) => {
    if (effect.parameters.type === 'tempHP') {
      target.tempHP = (target.tempHP || 0) + effect.parameters.amount;
    } else {
      target.shield = (target.shield || 0) + effect.parameters.amount;
    }
  },
  onRemove: (target, effect) => {
    if (effect.parameters.type === 'tempHP') {
      target.tempHP = Math.max(0, (target.tempHP || 0) - effect.parameters.amount);
    } else {
      target.shield = Math.max(0, (target.shield || 0) - effect.parameters.amount);
    }
  }
};

// ============================================================================
// MOVEMENT & SPEED EFFECTS
// ============================================================================

export const speedBonus: EffectHandler = {
  id: 'speedBonus',
  name: 'Speed Bonus',
  description: 'Increases movement speed',
  parameterSchema: {
    amount: { type: 'number', min: -30, max: 100, required: true },
    type: { type: 'string', enum: ['walk', 'fly', 'swim', 'burrow', 'climb'], default: 'walk' }
  },
  onApply: (target, effect) => {
    target.speed = target.speed || {};
    const speedType = effect.parameters.type;
    target.speed[speedType] = (target.speed[speedType] || 0) + effect.parameters.amount;
  },
  onRemove: (target, effect) => {
    target.speed = target.speed || {};
    const speedType = effect.parameters.type;
    target.speed[speedType] = Math.max(0, (target.speed[speedType] || 0) - effect.parameters.amount);
  }
};

// ============================================================================
// COMBAT ADVANTAGE EFFECTS
// ============================================================================

export const advantage: EffectHandler = {
  id: 'advantage',
  name: 'Advantage',
  description: 'Roll twice and use higher result for a specific check',
  parameterSchema: {
    checkType: { type: 'string', enum: ['attack', 'saving_throw', 'ability_check', 'all'], default: 'all' }
  },
  onAttackRoll: (target, effect, context) => {
    if (effect.parameters.checkType === 'all' || effect.parameters.checkType === 'attack') {
      context.hasAdvantage = true;
    }
  },
  onSavingThrow: (target, effect, context) => {
    if (effect.parameters.checkType === 'all' || effect.parameters.checkType === 'saving_throw') {
      context.hasAdvantage = true;
    }
  }
};

export const disadvantage: EffectHandler = {
  id: 'disadvantage',
  name: 'Disadvantage',
  description: 'Roll twice and use lower result for a specific check',
  parameterSchema: {
    checkType: { type: 'string', enum: ['attack', 'saving_throw', 'ability_check', 'all'], default: 'all' }
  },
  onAttackRoll: (target, effect, context) => {
    if (effect.parameters.checkType === 'all' || effect.parameters.checkType === 'attack') {
      context.hasDisadvantage = true;
    }
  },
  onSavingThrow: (target, effect, context) => {
    if (effect.parameters.checkType === 'all' || effect.parameters.checkType === 'saving_throw') {
      context.hasDisadvantage = true;
    }
  }
};

// ============================================================================
// CONDITION EFFECTS
// ============================================================================

export const blinded: EffectHandler = {
  id: 'blinded',
  name: 'Blinded',
  description: 'Character is blinded - disadvantage on attacks and perception',
  parameterSchema: {},
  onApply: (target, effect) => {
    target.conditions = target.conditions || [];
    if (!target.conditions.includes('blinded')) {
      target.conditions.push('blinded');
    }
  },
  onRemove: (target, effect) => {
    target.conditions = target.conditions || [];
    target.conditions = target.conditions.filter((c: string) => c !== 'blinded');
  },
  onAttackRoll: (target, effect, context) => {
    context.hasDisadvantage = true;
  }
};

export const stunned: EffectHandler = {
  id: 'stunned',
  name: 'Stunned',
  description: 'Character is stunned - cannot move or take actions',
  parameterSchema: {},
  onApply: (target, effect) => {
    target.conditions = target.conditions || [];
    if (!target.conditions.includes('stunned')) {
      target.conditions.push('stunned');
    }
    target.canAct = false;
    target.canMove = false;
  },
  onRemove: (target, effect) => {
    target.conditions = target.conditions || [];
    target.conditions = target.conditions.filter((c: string) => c !== 'stunned');
    target.canAct = true;
    target.canMove = true;
  }
};

export const prone: EffectHandler = {
  id: 'prone',
  name: 'Prone',
  description: 'Character is on the ground - disadvantage on melee attacks',
  parameterSchema: {},
  onApply: (target, effect) => {
    target.conditions = target.conditions || [];
    if (!target.conditions.includes('prone')) {
      target.conditions.push('prone');
    }
  },
  onRemove: (target, effect) => {
    target.conditions = target.conditions || [];
    target.conditions = target.conditions.filter((c: string) => c !== 'prone');
  }
};

// ============================================================================
// HEALING & REGENERATION EFFECTS
// ============================================================================

export const regeneration: EffectHandler = {
  id: 'regeneration',
  name: 'Regeneration',
  description: 'Regain hit points each turn',
  parameterSchema: {
    amount: { type: 'number', min: 1, max: 50, required: true },
    perTurn: { type: 'boolean', default: true },
    minHPThreshold: { type: 'number', min: 1, default: 1 }
  },
  onTick: (target, effect) => {
    if (target.hp.current < target.hp.max) {
      target.hp.current = Math.min(target.hp.max, target.hp.current + effect.parameters.amount);
    }
  }
};

// ============================================================================
// MAGIC & SPELL EFFECTS
// ============================================================================

export const concentrationRequired: EffectHandler = {
  id: 'concentrationRequired',
  name: 'Concentration Required',
  description: 'Effect requires concentration - breaks on damage above threshold',
  parameterSchema: {
    damageThreshold: { type: 'number', min: 1, max: 100, required: true }
  },
  onDamageReceived: (target, effect, context) => {
    if (context.totalDamage >= effect.parameters.damageThreshold) {
      // Trigger concentration check
      context.concentrationCheck = {
        required: true,
        dc: 10 + Math.floor(context.totalDamage / 2)
      };
    }
  }
};

// ============================================================================
// EFFECT REGISTRY
// ============================================================================

export const effectRegistry: Record<string, EffectHandler> = {
  // Damage & Protection
  damageBonus,
  damageResistance,
  damageImmunity,
  
  // Ability & Skills
  abilityBonus,
  skillBonus,
  
  // Armor & Defense
  acBonus,
  shieldBonus,
  
  // Movement
  speedBonus,
  
  // Combat Advantage
  advantage,
  disadvantage,
  
  // Conditions
  blinded,
  stunned,
  prone,
  
  // Healing
  regeneration,
  
  // Magic
  concentrationRequired,
};

export default effectRegistry;
