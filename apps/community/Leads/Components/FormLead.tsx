import React, { Component } from 'react';
import { deepObjectMerge, getUrlParam } from 'adios/Helper';
import HubletoForm, {HubletoFormProps, HubletoFormState} from "../../../../src/core/Components/HubletoForm";
import InputTags2 from 'adios/Inputs/Tags2';
import FormInput from 'adios/FormInput';
import request from 'adios/Request';
import TableLeadServices from './TableLeadServices';
import { TabPanel, TabView } from 'primereact/tabview';
import Calendar from '../../Calendar/Components/Calendar';
import Lookup from 'adios/Inputs/Lookup';
import TableLeadDocuments from './TableLeadDocuments';
import ModalSimple from 'adios/ModalSimple';
import FormDocument, { FormDocumentProps, FormDocumentState } from '../../Documents/Components/FormDocument';
import FormActivity, { FormActivityProps, FormActivityState } from './FormActivity';
import Hyperlink from 'adios/Inputs/Hyperlink';

export interface FormLeadProps extends HubletoFormProps {
  newEntryId?: number,
  tableLeadServicesDescription?: any,
  tableLeadDocumentsDescription?: any,
}

export interface FormLeadState extends HubletoFormState {
  newEntryId?: number,
  showIdDocument: number,
  showIdActivity: number,
  activityCalendarTimeClicked: string,
  activityCalendarDateClicked: string,
}

export default class FormLead<P, S> extends HubletoForm<FormLeadProps,FormLeadState> {
  static defaultProps: any = {
    ...HubletoForm.defaultProps,
    model: 'HubletoApp/Community/Leads/Models/Lead',
  };

  props: FormLeadProps;
  state: FormLeadState;

  translationContext: string = 'HubletoApp\\Community\\Leads\\Loader::Components\\FormLead';

  constructor(props: FormLeadProps) {
    super(props);
    this.state = {
      ...this.getStateFromProps(props),
      newEntryId: this.props.newEntryId ?? -1,
      showIdDocument: 0,
      showIdActivity: 0,
      activityCalendarTimeClicked: '',
      activityCalendarDateClicked: '',
    };
  }

  getStateFromProps(props: FormLeadProps) {
    return {
      ...super.getStateFromProps(props),
    };
  }

  renderTitle(): JSX.Element {
    if (getUrlParam('recordId') == -1) {
      return <h2>{this.translate('New Lead')}</h2>;
    } else {
      return <h2>{this.state.record.title ? this.state.record.title : '[Undefined Lead Name]'}</h2>
    }
  }

  renderSubTitle(): JSX.Element {
    return <small>{this.translate('Lead')}</small>;
  }

  getLeadSumPrice(recordServices: any) {
    var sumLeadPrice = 0;
    recordServices.map((service, index) => {
      if (service.unit_price && service.amount) {
        var sum = service.unit_price * service.amount
        if (service.discount) {
          sum = sum - (sum * (service.discount / 100))
        }
        if (service.tax) {
          sum = sum - (sum * (service.tax / 100))
        }
        sumLeadPrice += sum;
      }
    });
    return Number(sumLeadPrice.toFixed(2));
  }

  convertLead(recordId: number) {
    request.get(
      'leads/convert-to-deal',
      {recordId: recordId},
      (data: any) => {
        if (data.status == "success") {
          location.assign(globalThis.main.config.rewriteBase + `deals?recordId=${data.idDeal}&recordTitle=${data.title}`)
        }
      }
    );
  }

  convertDealWarning(recordId: number) {
    globalThis.main.showDialogDanger(
      <>
        <div>
          Are you sure you want to convert this Lead to a Deal?<br/>
        </div>
        <div className="alert-warning mt-4">
          This lead will be moved to archive after conversion.<br/>
        </div>
      </>,
      {
        headerClassName: "dialog-warning-header",
        header: "Convert to a Deal",
        footer: <>
          <button
            className="btn btn-yellow"
            onClick={() => {this.convertLead(recordId)}}
          >
            <span className="icon"><i className="fas fa-forward"></i></span>
            <span className="text">Yes, convert to a Deal</span>
          </button>
          <button
            className="btn btn-transparent"
            onClick={() => {
              globalThis.main.lastShownDialogRef.current.hide();
            }}
          >
            <span className="icon"><i className="fas fa-times"></i></span>
            <span className="text">No, do not convert to a Deal</span>
          </button>
        </>
      }
    );
  }

  renderContent(): JSX.Element {
    const R = this.state.record;
    const showAdditional = R.id > 0 ? true : false;
    if (R.HISTORY && R.HISTORY.length > 0) {
      if (R.HISTORY.length > 1 && (R.HISTORY[0].id < R.HISTORY[R.HISTORY.length-1].id))
        R.HISTORY = this.state.record.HISTORY.reverse();
    }

    if (R.DEAL) R.DEAL.checkOwnership = false;

    if (R.id > 0 && globalThis.main.idUser != R.id_user && !this.state.recordChanged) {
      return (
        <>
          <div className='w-full h-full flex flex-col justify-center'>
            <span className='text-center'>This lead belongs to a different user</span>
          </div>
        </>
      )
    }

    return (
      <>
        <TabView>
          <TabPanel header={this.translate('Lead')}>
            {R.DEAL && R.is_archived == 1 ?
              <div className='alert-warning mt-2 mb-1'>
                <span className='icon mr-2'><i className='fas fa-triangle-exclamation'></i></span>
                <span className='text'>This lead was converted to a deal and cannot be edited</span>
              </div>
            : null}
            <div className='grid grid-cols-2 gap-1' style=
              {{gridTemplateAreas:`
                'notification notification'
                'info info'
                'notes notes'
                'services services'
                'history history'
              `}}>
              <div className='card mt-2' style={{gridArea: 'info'}}>
                <div className='card-body flex flex-row gap-2'>
                  <div className='grow'>
                    {this.inputWrapper('identifier', {readonly: R.is_archived})}
                    {this.inputWrapper('title', {readonly: R.is_archived})}
                    <FormInput title={"Customer"}>
                      <Lookup {...this.getInputProps()}
                        model='HubletoApp/Community/Customers/Models/Customer'
                        endpoint={`customers/get-customer`}
                        readonly={R.is_archived}
                        value={R.id_customer}
                        onChange={(value: any) => {
                          this.updateRecord({ id_customer: value, id_person: null });
                          if (R.id_customer == 0) {
                            R.id_customer = null;
                            this.setState({record: R});
                          }
                        }}
                      ></Lookup>
                    </FormInput>
                    <FormInput title={"Contact Person"}>
                      <Lookup {...this.getInputProps()}
                        model='HubletoApp/Community/Customers/Models/Person'
                        customEndpointParams={{id_customer: R.id_customer}}
                        readonly={R.is_archived}
                        endpoint={`contacts/get-customer-contacts`}
                        value={R.id_person}
                        onChange={(value: any) => {
                          this.updateRecord({ id_person: value })
                          if (R.id_person == 0) {
                            R.id_person = null;
                            this.setState({record: R})
                          }
                        }}
                      ></Lookup>
                    </FormInput>
                    <div className='flex flex-row *:w-1/2'>
                      {this.inputWrapper('price', {
                        readonly: (R.SERVICES && R.SERVICES.length) > 0 || R.is_archived ? true : false,
                      })}
                      {this.inputWrapper('id_currency')}
                    </div>
                    {showAdditional ? this.inputWrapper('id_lead_status', {readonly: R.is_archived}) : null}
                    {showAdditional ?
                      <div className='w-full mt-2'>
                        {R.DEAL != null ?
                        <a className='btn btn-primary' href={`../deals?recordId=${R.DEAL.id}&recordTitle=${R.DEAL.title}`}>
                          <span className='icon'><i className='fas fa-arrow-up-right-from-square'></i></span>
                          <span className='text'>{this.translate('Go to deal')}</span>
                        </a>
                        :
                        <a className='btn btn-primary cursor-pointer' onClick={() => this.convertDealWarning(R.id)}>
                          <span className='icon'><i className='fas fa-rotate-right'></i></span>
                          <span className='text'>Convert to Deal</span>
                        </a>}
                      </div>
                    : null}
                  </div>
                  <div className='border-l border-gray-200'></div>
                  <div className='grow'>
                    {this.inputWrapper('id_user', {readonly: R.is_archived})}
                    {this.inputWrapper('date_expected_close', {readonly: R.is_archived})}
                    {this.inputWrapper('source_channel', {readonly: R.is_archived})}
                    <FormInput title='Tags'>
                      <InputTags2 {...this.getInputProps('tags_input')}
                        value={this.state.record.TAGS}
                        readonly={R.is_archived}
                        model='HubletoApp/Community/Settings/Models/Tag'
                        targetColumn='id_lead'
                        sourceColumn='id_tag'
                        colorColumn='color'
                        onChange={(value: any) => {
                          this.updateRecord({TAGS: value});
                        }}
                      ></InputTags2>
                    </FormInput>
                    {showAdditional ? this.inputWrapper('date_created') : null}
                    {showAdditional ? this.inputWrapper('is_archived') : null}
                  </div>
                </div>
              </div>
              <div className='card card-body' style={{gridArea: 'notes'}}>
                {this.inputWrapper('note', {readonly: R.is_archived})}
              </div>
              {showAdditional ?
                <div className='card mt-2' style={{gridArea: 'services'}}>
                  <div className='card-header'>Services</div>
                  <div className='card-body flex flex-col gap-2'>
                    {!R.is_archived ? (
                      <a
                        role="button"
                        onClick={() => {
                          if (!R.SERVICES) R.SERVICES = [];
                          R.SERVICES.push({
                            id: this.state.newEntryId,
                            id_lead: { _useMasterRecordId_: true },
                            amount: 1,
                          });
                          this.setState({ record: R, isInlineEditing: true, newEntryId: this.state.newEntryId - 1 } as FormLeadState);
                        }}>
                        + Add service
                      </a>
                    ) : null}
                    <div className='w-full h-full overflow-x-auto'>
                      <TableLeadServices
                        uid={this.props.uid + "_table_lead_services"}
                        data={{ data: R.SERVICES }}
                        leadTotal={R.SERVICES && R.SERVICES.length > 0 ? "Total: " + R.price + " " + R.CURRENCY.code : "Total: 0 " + R.CURRENCY.code }
                        descriptionSource='props'
                        customEndpointParams={{'idLead': R.id}}
                        description={{
                          permissions: this.props.tableLeadServicesDescription.permissions,
                          ui: {
                            showHeader: false,
                            showFooter: true
                          },
                          columns: {
                            id_service: { type: "lookup", title: "Service",
                              model: "HubletoApp/Community/Services/Models/Service",
                              cellRenderer: ( table: TableLeadServices, data: any, options: any): JSX.Element => {
                                return (
                                  <FormInput>
                                    <Lookup {...this.getInputProps()}
                                      model='HubletoApp/Community/Services/Models/Service'
                                      cssClass='min-w-44'
                                      value={data.id_service}
                                      onChange={(value: any) => {
                                        request.get(
                                          'services/get-service-price',
                                          {serviceId: value},
                                          (returnData: any) => {
                                            if (returnData.status == "success") {
                                              data.id_service = value;
                                              data.unit_price = returnData.unit_price;
                                              this.updateRecord({ SERVICES: table.state.data?.data });
                                              this.updateRecord({ price: this.getLeadSumPrice(R.SERVICES)});
                                            } else {
                                              throw new Error('Something went wrong: ' + returnData.error);
                                            }
                                          }
                                        )
                                      }}
                                    ></Lookup>
                                  </FormInput>
                                )
                              },
                            },
                            unit_price: { type: "float", title: "Unit Price" },
                            amount: { type: "int", title: "Amount" },
                            discount: { type: "float", title: "Discount (%)" },
                            tax: { type: "float", title: "Tax (%)" },
                            __sum: { type: "none", title: "Sum", cellRenderer: ( table: TableLeadServices, data: any, options: any): JSX.Element => {
                              if (data.unit_price && data.amount) {
                                var sum = data.unit_price * data.amount
                                if (data.discount) {
                                  sum = sum - (sum * (data.discount / 100))
                                }
                                if (data.tax) {
                                  sum = sum - (sum * (data.tax / 100))
                                }
                                sum = Number(sum.toFixed(2));
                                return (<>
                                    <span>{sum} {R.CURRENCY.code}</span>
                                  </>
                                );
                              }
                            },
                          },
                          },
                          inputs: {
                            id_service: { type: "lookup", title: "Service",
                              model: "HubletoApp/Community/Services/Models/Service",
                              cellRenderer: ( table: TableLeadServices, data: any, options: any): JSX.Element => {
                                return (
                                  <FormInput>
                                    <Lookup {...this.getInputProps()}
                                      model='HubletoApp/Community/Services/Models/Service'
                                      cssClass='min-w-44'
                                      value={data.id_service}
                                      onChange={(value: any) => {
                                        request.get(
                                          'services/get-service-price',
                                          {serviceId: value},
                                          (returnData: any) => {
                                            if (returnData.status == "success") {
                                              data.id_service = value;
                                              data.unit_price = returnData.unit_price;
                                              this.updateRecord({ SERVICES: table.state.data?.data });
                                              this.updateRecord({ price: this.getLeadSumPrice(R.SERVICES)});
                                            } else {
                                              throw new Error('Something went wrong: ' + returnData.error);
                                            }
                                          }
                                        )
                                      }}
                                    ></Lookup>
                                  </FormInput>
                                )
                              },
                            },
                            unit_price: { type: "float", title: "Unit Price" },
                            amount: { type: "int", title: "Amount" },
                            discount: { type: "float", title: "Discount (%)" },
                            tax: { type: "float", title: "Tax (%)" },
                            __sum: { type: "none", title: "Sum", cellRenderer: ( table: TableLeadServices, data: any, options: any): JSX.Element => {
                              if (data.unit_price && data.amount) {
                                var sum = data.unit_price * data.amount
                                if (data.discount) {
                                  sum = sum - (sum * (data.discount / 100))
                                }
                                if (data.tax) {
                                  sum = sum - (sum * (data.tax / 100))
                                }
                                sum = Number(sum.toFixed(2));
                                return (<>
                                    <span>{sum} {R.CURRENCY.code}</span>
                                  </>
                                );
                              }
                            },
                          },
                          },
                        }}
                        isUsedAsInput={true}
                        isInlineEditing={this.state.isInlineEditing}
                        readonly={R.is_archived == true ? false : !this.state.isInlineEditing}
                        onRowClick={() => this.setState({isInlineEditing: true})}
                        onChange={(table: TableLeadServices) => {
                          this.updateRecord({ SERVICES: table.state.data?.data });
                          R.price = this.getLeadSumPrice(R.SERVICES);
                          this.setState({record: R});
                        }}
                        onDeleteSelectionChange={(table: TableLeadServices) => {
                          this.updateRecord({ SERVICES: table.state.data?.data ?? [] });
                        }}
                      ></TableLeadServices>
                    </div>
                  </div>
                </div>
              : null}
            </div>
          </TabPanel>
          {showAdditional ?
            <TabPanel header={this.translate('Calendar')}>
              <Calendar
                onCreateCallback={() => this.loadRecord()}
                readonly={R.is_archived}
                views={"timeGridDay,timeGridWeek,dayGridMonth,listYear"}
                eventsEndpoint={globalThis.main.config.rewriteBase + 'leads/get-calendar-events?idLead=' + R.id}
                onDateClick={(date, time, info) => {
                  this.setState({
                    activityCalendarDateClicked: date,
                    activityCalendarTimeClicked: time,
                    showIdActivity: -1,
                  } as FormLeadState);
                }}
                onEventClick={(info) => {
                  this.setState({
                    showIdActivity: parseInt(info.event.id),
                  } as FormLeadState);
                }}
              ></Calendar>
              {this.state.showIdActivity == 0 ? <></> :
                <ModalSimple
                  uid='activity_form'
                  isOpen={true}
                  type='right'
                >
                  <FormActivity
                    id={this.state.showIdActivity}
                    isInlineEditing={true}
                    description={{
                      defaultValues: {
                        id_lead: R.id,
                        date_start: this.state.activityCalendarDateClicked,
                        time_start: this.state.activityCalendarTimeClicked == "00:00:00" ? null : this.state.activityCalendarTimeClicked,
                        date_end: this.state.activityCalendarDateClicked,
                      }
                    }}
                    idCustomer={R.id_customer}
                    showInModal={true}
                    showInModalSimple={true}
                    onClose={() => { this.setState({ showIdActivity: 0 } as FormLeadState) }}
                    onSaveCallback={(form: FormActivity<FormActivityProps, FormActivityState>, saveResponse: any) => {
                      if (saveResponse.status == "success") {
                        this.setState({ showIdActivity: 0 } as FormLeadState);
                      }
                    }}
                  ></FormActivity>
                </ModalSimple>
              }
            </TabPanel>
          : null}
          {showAdditional ? (
            <TabPanel header={this.translate("Documents")}>
              <div className="divider"><div><div><div></div></div><div><span>{this.translate('Shared documents')}</span></div></div></div>
              {this.inputWrapper('shared_folder', {readonly: R.is_archived})}
              <div className="divider"><div><div><div></div></div><div><span>{this.translate('Local documents')}</span></div></div></div>
              {!R.is_archived ?
                <a
                  role="button"
                  onClick={() => this.setState({showIdDocument: -1} as FormLeadState)}
                >
                  + Add Document
                </a>
              : null}
              <TableLeadDocuments
                uid={this.props.uid + "_table_lead_document"}
                data={{ data: R.DOCUMENTS }}
                descriptionSource="both"
                customEndpointParams={{idLead: R.id}}
                description={{
                  permissions: this.props.tableLeadDocumentsDescription.permissions,
                  ui: {
                    showFooter: false,
                    showHeader: false,
                  },
                  columns: {
                    id_document: { type: "lookup", title: "Document", model: "HubletoApp/Community/Documents/Models/Document" },
                    hyperlink: { type: "varchar", title: "Link", cellRenderer: ( table: TableLeadDocuments, data: any, options: any): JSX.Element => {
                      return (
                        <FormInput>
                          <Hyperlink {...this.getInputProps('link_input')}
                            value={data.DOCUMENT.hyperlink}
                            readonly={true}
                          ></Hyperlink>
                        </FormInput>
                      )
                    }},
                  },
                  inputs: {
                    id_document: { type: "lookup", title: "Document", model: "HubletoApp/Community/Documents/Models/Document" },
                    hyperlink: { type: "varchar", title: "Link", readonly: true},
                  },
                }}
                isUsedAsInput={true}
                readonly={R.is_archived == true ? false : !this.state.isInlineEditing}
                onRowClick={(table: TableLeadDocuments, row: any) => {
                  this.setState({showIdDocument: row.id_document} as FormLeadState);
                }}
              />
              {this.state.showIdDocument != 0 ?
                <ModalSimple
                  uid='document_form'
                  isOpen={true}
                  type='right'
                >
                  <FormDocument
                    id={this.state.showIdDocument}
                    onClose={() => this.setState({showIdDocument: 0} as FormLeadState)}
                    showInModal={true}
                    descriptionSource="both"
                    description={{
                      defaultValues: {
                        creatingForModel: "HubletoApp/Community/Leads/Models/LeadDocument",
                        creatingForId: this.state.record.id,
                        origin_link: window.location.pathname + "?recordId=" + this.state.record.id,
                      }
                    }}
                    isInlineEditing={this.state.showIdDocument < 0 ? true : false}
                    showInModalSimple={true}
                    onSaveCallback={(form: FormDocument<FormDocumentProps, FormDocumentState>, saveResponse: any) => {
                      if (saveResponse.status = "success") {
                        this.loadRecord();
                        this.setState({ showIdDocument: 0 } as FormLeadState)
                      }
                    }}
                    onDeleteCallback={(form: FormDocument<FormDocumentProps, FormDocumentState>, saveResponse: any) => {
                      if (saveResponse.status = "success") {
                        this.loadRecord();
                        this.setState({ showIdDocument: 0 } as FormLeadState)
                      }
                    }}
                  />
                </ModalSimple>
              : null}
            </TabPanel>
          ) : null}
          {showAdditional ?
            <TabPanel header={this.translate('History')}>
              {R.HISTORY.length > 0 ?
                R.HISTORY.map((history, key) => (
                  <div className='w-full flex flex-row justify-between'>
                    <div className='w-1/3'>
                        <p className='font-bold self-center text-sm text-left'>
                          {history.description}
                        </p>
                      </div>
                    <div className='w-1/3' style={{alignContent: "center"}}>
                      <hr style={{width: "100%", alignSelf: "center"}}/>
                    </div>
                    <div className='w-1/3 justify-center'>
                      <p className='self-center text-sm text-center'>
                        {history.change_date}
                      </p>
                    </div>
                  </div>
                ))
                :
                <p className='text-gray-400'>Lead has no history</p>
              }
            </TabPanel>
          : null}
        </TabView>
      </>
    );
  }
}