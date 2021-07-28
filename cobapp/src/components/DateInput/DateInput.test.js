import React from 'react'
import { shallow, mount } from '../../enzyme'
import TestRenderer from 'react-test-renderer'

import DateInput from './index'

jest.mock('react-text-mask', () => props => <input type="text" {...{ ...props }} />)

describe('Render DateInput component', () => {
    it('render correctly date component and create a snapshot', () => {
        const wrapper = shallow(<DateInput />)
        expect(wrapper.find('DatePicker').length).toBe(1)
        const DateInputComponent = TestRenderer.create(<DateInput />).toJSON()
        expect(DateInputComponent).toMatchSnapshot()
    })

    it('testing dateInput passed a string', () => {
        const props = {
            value : '10.05.2018'
        }
        const DateInputComponent = mount(<DateInput {...props} />)
        expect(DateInputComponent.prop('value')).toBe('10.05.2018')
    })

    it('render date input correctly with null value', () => {  
        const props = { 
            value: null 
        }
        const DateInputComponent = mount(<DateInput {...props} />)
        expect((DateInputComponent).prop('value')).toBeNull()
    })

    it('testing dateInput passed a number and expected a string', () => {
        const props = {
            value : '10/10/2019'
        }
        const DateInputComponent = mount(<DateInput {...props} />)
        expect(DateInputComponent.prop('value')).toEqual('10/10/2019') //aqui é pra falhar
    })
})