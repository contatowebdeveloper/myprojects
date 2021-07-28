import React from 'react'
import { shallow } from '../../enzyme'
import TestRenderer from 'react-test-renderer'

import Pager from './index'

describe('Render Page component', () => {
    it('render correctly pager component and create a snapshot', () => {
        const wrapper = shallow(<Pager />)
        expect(wrapper.find('div').length).toBe(1)
        const PagerComponent = TestRenderer.create(<Pager />).toJSON()
        expect(PagerComponent).toMatchSnapshot()
    })  
})