import React, { Component } from 'react'


export default class PurchaseForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let r = this.props.currentRecord;
        if (!r.title) {
            return null;
        }
        else {
            return pug`
            form.app-form(onSubmit=this.props.createEntry,method="post",className=this.props.mode)
                .inner
                    .flex-row
                        .col-full
                            - let thisTitle = "Purchase of "+r.distributor.textValue+"'s "+r.product.textValue+" from "+r.dispensary.textValue
                            h2=thisTitle
                    .flex-row
                        .col-full
                            .range-vert=r.thc.formControl.el(r,"thc","false") || ""
                    .flex-row
                        .col-3=r.distributor.formControl.el(r,"distributor","false") || ""
                        .col-3=r.product.formControl.el(r,"product","false") || ""
                        .col-3=r.dispensary.formControl.el(r,"dispensary","false") || ""
                    .flex-row
                        .col-2=r.weight.formControl.el(r,"weight","false") || ""
                        .col-2=r.price.formControl.el(r,"price","false") || ""
                    .flex-row
                        .col-full=r.images.formControl.el(r,"images","false")
                    .flex-row                
                        if this.props.mode == "edit"
                            .col-2
                                button(id='btn-update',onClick=this.props.updateEntry,key='btn-update') Update Record
                            .col-2
                                button(id='btn-delete',onClick=this.props.deleteEntry,key='btn-delete') Delete Record
                        else
                            .col-full
                                button(key='btn-submit', id='btn-submit',type="submit") Send Form
                        .col-full.alert-box(key='error-box')
                            p(key='msg-wrapper')=this.props.msg`
        }
    }
}