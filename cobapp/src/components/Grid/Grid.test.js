import React from 'react'
import { mount } from '../../enzyme'
// import TestRenderer from 'react-test-renderer'
// import Grid from './index'
import { Header } from './header'
import { Row } from './row'

describe("Render Grid", () => {
    // it('render correctly grid component and create a snapshot', () => {
    //     const registries = ["11/03/2019", "364 - VALOR DE QUITAÇÃO CONTRATUAL"]
        
    //     // const wrapper = render(<Grid registries={registries} columns={registries} />)
    //     // expect(wrapper.find('table').length).toEqual(1)
    //     const SelectInputComponent = TestRenderer.create(<Grid registries={registries} columns={registries} />).toJSON()
    //     expect(SelectInputComponent).toMatchSnapshot()
    // })

    it('render fake data rowGrid', () => {
        const registries = ["11/03/2019", "364 - VALOR DE QUITAÇÃO CONTRATUAL"]

        const GridComponent = mount(<Row columns={registries} /> )
        expect(GridComponent.find('tr').length).toBe(1)
    })

    it('render fake data headerGrid', () => {
        const props = ["Data", "Descrição"]

        const GridComponent = mount(<Header headerGrid={props} /> )
        expect(GridComponent.find('th').length).toEqual(2)
    })
})