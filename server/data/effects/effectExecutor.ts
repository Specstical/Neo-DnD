/**
 * Effect Executor System
 * 
 * Manages effect lifecycle, event triggering, and handler execution
 */

import { effectRegistry } from './baseEffects';

export interface EffectInstance {
  id: string;
  handlerType: string;
  name: string;
  duration: number; // -1 = permanent, 0+ = turns remaining
  stacks: number;
  maxStacks: number;
  stackable: boolean;
  parameters: Record<string, any>;
  appliedAt?: number;
  source?: string; // Character or item ID that applied this
}

export class EffectExecutor {
  private activeEffects: Map<string, EffectInstance[]> = new Map();

  /**
   * Apply an effect to a target
   */
  applyEffect(target: any, effect: EffectInstance, source?: any): boolean {
    const handler = effectRegistry[effect.handlerType];
    
    if (!handler) {
      console.error(`Handler not found: ${effect.handlerType}`);
      return false;
    }

    // Validate parameters
    if (handler.validate && !handler.validate(effect.parameters)) {
      console.error(`Invalid parameters for effect: ${effect.handlerType}`, effect.parameters);
      return false;
    }

    // Get or create target effects list
    const targetId = target.id || String(target);
    if (!this.activeEffects.has(targetId)) {
      this.activeEffects.set(targetId, []);
    }

    const targetEffects = this.activeEffects.get(targetId)!;

    // Check for stacking
    const existingEffect = targetEffects.find((e) => e.handlerType === effect.handlerType);
    if (existingEffect) {
      if (existingEffect.stackable && existingEffect.stacks < existingEffect.maxStacks) {
        existingEffect.stacks++;
        return true;
      } else if (!existingEffect.stackable) {
        // Replace existing effect
        this.removeEffect(target, existingEffect.id);
      }
    }

    // Add effect
    effect.appliedAt = Date.now();
    effect.source = source?.id || source;
    targetEffects.push(effect);

    // Call onApply handler
    if (handler.onApply) {
      handler.onApply(target, effect);
    }

    return true;
  }

  /**
   * Remove a specific effect
   */
  removeEffect(target: any, effectId: string): boolean {
    const targetId = target.id || String(target);
    const effects = this.activeEffects.get(targetId);

    if (!effects) {
      return false;
    }

    const index = effects.findIndex((e) => e.id === effectId);
    if (index === -1) {
      return false;
    }

    const effect = effects[index];
    const handler = effectRegistry[effect.handlerType];

    // Call onRemove handler
    if (handler && handler.onRemove) {
      handler.onRemove(target, effect);
    }

    effects.splice(index, 1);
    return true;
  }

  /**
   * Remove all effects from a target
   */
  clearEffects(target: any): void {
    const targetId = target.id || String(target);
    const effects = this.activeEffects.get(targetId);

    if (!effects) {
      return;
    }

    [...effects].forEach((effect) => {
      this.removeEffect(target, effect.id);
    });

    this.activeEffects.delete(targetId);
  }

  /**
   * Process effect ticks (reduce duration, trigger onTick)
   */
  tickEffects(target: any): void {
    const targetId = target.id || String(target);
    const effects = this.activeEffects.get(targetId);

    if (!effects || effects.length === 0) {
      return;
    }

    const toRemove: string[] = [];

    effects.forEach((effect) => {
      const handler = effectRegistry[effect.handlerType];

      // Tick the effect
      if (handler && handler.onTick) {
        handler.onTick(target, effect);
      }

      // Reduce duration
      if (effect.duration > 0) {
        effect.duration--;
        if (effect.duration === 0) {
          toRemove.push(effect.id);
        }
      }
    });

    // Remove expired effects
    toRemove.forEach((id) => this.removeEffect(target, id));
  }

  /**
   * Trigger an event for all active effects
   */
  triggerEvent(target: any, eventName: string, context: any = {}): void {
    const targetId = target.id || String(target);
    const effects = this.activeEffects.get(targetId);

    if (!effects || effects.length === 0) {
      return;
    }

    effects.forEach((effect) => {
      const handler = effectRegistry[effect.handlerType];

      if (handler && (handler as any)[eventName]) {
        try {
          (handler as any)[eventName](target, effect, context);
        } catch (error) {
          console.error(`Error in effect ${effect.id} event ${eventName}:`, error);
        }
      }
    });
  }

  /**
   * Get all active effects on a target
   */
  getEffects(target: any): EffectInstance[] {
    const targetId = target.id || String(target);
    return this.activeEffects.get(targetId) || [];
  }

  /**
   * Get active effects of a specific type
   */
  getEffectsByType(target: any, handlerType: string): EffectInstance[] {
    const effects = this.getEffects(target);
    return effects.filter((e) => e.handlerType === handlerType);
  }

  /**
   * Check if target has a specific effect
   */
  hasEffect(target: any, handlerType: string): boolean {
    return this.getEffectsByType(target, handlerType).length > 0;
  }

  /**
   * Get total value of stacked effects
   */
  getStackedValue(target: any, handlerType: string): number {
    const effects = this.getEffectsByType(target, handlerType);
    return effects.reduce((sum, e) => sum + e.stacks, 0);
  }

  /**
   * Serialize active effects for storage/transmission
   */
  serializeEffects(target: any): EffectInstance[] {
    return this.getEffects(target).map((effect) => ({
      id: effect.id,
      handlerType: effect.handlerType,
      name: effect.name,
      duration: effect.duration,
      stacks: effect.stacks,
      maxStacks: effect.maxStacks,
      stackable: effect.stackable,
      parameters: effect.parameters,
      appliedAt: effect.appliedAt,
      source: effect.source,
    }));
  }

  /**
   * Restore effects from serialized data
   */
  deserializeEffects(target: any, serialized: EffectInstance[]): void {
    serialized.forEach((effect) => {
      this.applyEffect(target, effect);
    });
  }
}

export default new EffectExecutor();
