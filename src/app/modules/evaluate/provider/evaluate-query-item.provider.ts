import { Injectable } from '@angular/core';
import { Item, ItemRarity } from '@shared/module/poe/type';
import { EvaluateUserSettings } from '../component/evaluate-settings/evaluate-settings.component';

export interface EvaluateQueryItemResult {
    queryItem: Item;
    defaultItem: Item;
}

@Injectable({
    providedIn: 'root'
})
export class EvaluateQueryItemProvider {
    public provide(item: Item, settings: EvaluateUserSettings): EvaluateQueryItemResult {
        const defaultItem: Item = this.copy({
            nameId: item.nameId,
            typeId: item.typeId,
            category: item.category,
            rarity: item.rarity,
            corrupted: item.corrupted,
            veiled: item.veiled,
            influences: item.influences || {},
            damage: {},
            stats: [],
            properties: {
                qualityType: (item.properties || {}).qualityType
            },
            requirements: {},
            sockets: new Array((item.sockets || []).length).fill({}),
        });
        const queryItem = this.copy(defaultItem);

        if (settings.evaluateQueryDefaultItemLevel) {
            queryItem.level = item.level;
        }

        if (settings.evaluateQueryDefaultSockets) {
            queryItem.sockets = item.sockets;
        }

        if (settings.evaluateQueryDefaultMiscs) {
            const prop = item.properties;
            if (prop) {
                queryItem.properties.gemLevel = prop.gemLevel;
                queryItem.properties.mapTier = prop.mapTier;
                if (item.rarity === ItemRarity.Gem || prop.qualityType > 0) {
                    queryItem.properties.quality = prop.quality;
                }
            }
        }

        if (!settings.evaluateQueryDefaultType) {
            if (!item.nameId && (item.rarity === ItemRarity.Magic || item.rarity === ItemRarity.Rare)) {
                queryItem.typeId = undefined;
            }
        }

        if (item.stats) {
            queryItem.stats = item.stats.map(stat => {
                const key = `${stat.type}.${stat.tradeId}`;
                return settings.evaluateQueryDefaultStats[key] ? stat : undefined;
            });
        }

        return {
            defaultItem: this.copy(defaultItem),
            queryItem: this.copy(queryItem)
        };
    }

    private copy(item: Item): Item {
        return JSON.parse(JSON.stringify(item));
    }
}
