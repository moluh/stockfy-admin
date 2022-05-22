import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { AddEditProductsPage } from './add-edit-products.page'

describe('AddEditProductsPage', () => {
    let component: AddEditProductsPage
    let fixture: ComponentFixture<AddEditProductsPage>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddEditProductsPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents()

        fixture = TestBed.createComponent(AddEditProductsPage)
        component = fixture.componentInstance
        fixture.detectChanges()
    }))

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
