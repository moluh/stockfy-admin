import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TabBrandsComponent } from './tab-brands.component'

describe('TabBrandsComponent', () => {
    let component: TabBrandsComponent
    let fixture: ComponentFixture<TabBrandsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TabBrandsComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(TabBrandsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
