import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SeeMovementComponent } from './see-movement.component'

describe('SeeMovementComponent', () => {
    let component: SeeMovementComponent
    let fixture: ComponentFixture<SeeMovementComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SeeMovementComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SeeMovementComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
