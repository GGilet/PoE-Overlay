import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { Language } from '../../type';
import { ContextService } from '../context.service';
import { BaseItemTypesService } from './base-item-types.service';

describe('BaseItemTypeService', () => {
    let sut: BaseItemTypesService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<BaseItemTypesService>(BaseItemTypesService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    const languages: Language[] = [
        Language.English,
        Language.German,
        Language.French,
        Language.Korean,
        Language.Russian,
    ];
    const texts = [
        'Orbe du chaos',
        `Pierre à aiguiser de forgeron`,
    ];
    texts.forEach(text => {
        languages.forEach(language => {
            it(`should search for text: '${text}' in French and translate in '${Language[language]}'`, () => {
                const id = sut.search(text, Language.French);
                expect(id).toBeTruthy();
                const localizedText = sut.translate(id, language);
                expect(localizedText.indexOf('untranslated') === -1).toBeTruthy();
            });
        });
    });

    it(`should find 'Blighted Port Map'`, () => {
        const result = sut.search('Blighted Port Map', Language.English);
        expect(result).toBe('MapAtlasQuay');
    });

    it(`should find 'Port Map'`, () => {
        const result = sut.search('Port Map', Language.English);
        expect(result).toBe('MapWorldsPort');
    });

    it(`should find 'Vaal Summon Skeletons'`, () => {
        const result = sut.search('Vaal Summon Skeletons', Language.English);
        expect(result).toBe('SkillGemVaalSummonSkeletons');
    });
});
