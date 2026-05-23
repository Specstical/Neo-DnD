class CHARACTER {
  name: string;
  level: number;
  class: string;
  race: string;
  experience: number;
  userId: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  inventory: { gold: number; items: any[] };
  activeEffects: any[];
  feats: any[];
  skills: Record<string, number>;
  proficiencies: string[];
  updatedAt: Date;

  constructor(data: any) {
    this.name = data.name;
    this.level = data.level || 1;
    this.class = data.class;
    this.race = data.race || "Human";
    this.experience = data.experience || 0;
    this.userId = data.userId;
    this.inventory = data.inventory || { gold: 0, items: [] };
    this.stats = data.stats || {};
    this.activeEffects = data.activeEffects || [];
    this.feats = data.feats || [];
    this.skills = data.skills || {};
    this.proficiencies = data.proficiencies || [];

    this.updatedAt = data.updatedAt || new Date();
  }

  get armorClass(): number {
    return 0; // Placeholder, calculate based on equipped armor and effects
  }
}
