import React from 'react'
import TestRenderer from 'react-test-renderer'

import { store } from '../../store'
import { Provider } from 'react-redux'

import FormDialog from './index'

describe('Render Modal component', () => {
    it('render correctly formDialog component', () => {
        const FormDialogComponent = TestRenderer.create(<Provider store={store} ><FormDialog /></Provider>).toJSON()
        expect(FormDialogComponent).toMatchSnapshot()
    })
})