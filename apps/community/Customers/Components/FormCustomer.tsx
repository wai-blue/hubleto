import React, { Component } from "react";
import { deepObjectMerge, getUrlParam } from "adios/Helper";
import HubletoForm, {HubletoFormProps, HubletoFormState} from "../../../../src/core/Components/HubletoForm";
import InputTags2 from "adios/Inputs/Tags2";
import FormInput from "adios/FormInput";
import TablePersons from "../../Contacts/Components/TablePersons";
import { TabPanel, TabView } from "primereact/tabview";
import FormActivity, {FormActivityProps, FormActivityState} from "./FormActivity";
import TableLeads from "../../Leads/Components/TableLeads";
import FormLead, {FormLeadProps, FormLeadState} from "../../Leads/Components/FormLead";
import ModalSimple from "adios/ModalSimple";
import TableDeals from "../../Deals/Components/TableDeals";
import FormDeal, {FormDealProps, FormDealState} from "../../Deals/Components/FormDeal";
import TableCustomerDocuments from "./TableCustomerDocuments";
import FormDocument, {FormDocumentProps, FormDocumentState} from "../../Documents/Components/FormDocument";
import FormPerson, {FormPersonProps, FormPersonState} from "../../Contacts/Components/FormPerson";
import Calendar from '../../Calendar/Components/Calendar'
import Hyperlink from "adios/Inputs/Hyperlink";
import request from "adios/Request";

export interface FormCustomerProps extends HubletoFormProps {
  highlightIdActivity: number,
  createNewLead: boolean,
  createNewDeal: boolean,
  newEntryId?: number,
  tablePersonsDescription?: any,
  tableLeadsDescription?: any,
  tableDealsDescription?: any,
  tableDocumentsDescription?: any,
}

interface FormCustomerState extends HubletoFormState {
  highlightIdActivity: number,
  createNewLead: boolean,
  createNewDeal: boolean,
  createNewPerson: boolean,
  newEntryId?: number,
  showIdDocument: number,
  showIdActivity: number,
  activityCalendarTimeClicked: string,
  activityCalendarDateClicked: string,
  tableContactsDescription?: any,
}

export default class FormCustomer<P, S> extends HubletoForm<FormCustomerProps, FormCustomerState> {
  static defaultProps: any = {
    ...HubletoForm.defaultProps,
    model: "HubletoApp/Community/Customers/Models/Customer",
  };

  props: FormCustomerProps;
  state: FormCustomerState;

  translationContext: string = 'HubletoApp\\Community\\Customers\\Loader::Components\\FormCustomer';

  constructor(props: FormCustomerProps) {
    super(props);

    this.state = {
      ...this.getStateFromProps(props),
      highlightIdActivity: this.props.highlightIdActivity ?? 0,
      createNewLead: false,
      createNewDeal: false,
      createNewPerson: false,
      showIdDocument: 0,
      newEntryId: this.props.newEntryId ?? -1,
      showIdActivity: 0,
      activityCalendarTimeClicked: '',
      activityCalendarDateClicked: '',
    }
  }

  getStateFromProps(props: FormCustomerProps) {
    return {
      ...super.getStateFromProps(props),
    };
  }

  onBeforeSaveRecord(record: any) {
    //Delete all spaces in identifiers
    if (record.tax_id) record.tax_id = record.tax_id.replace(/\s+/g, "");
    if (record.vat_id) record.vat_id = record.vat_id.replace(/\s+/g, "");
    if (record.customer_id) record.customer_id = record.customer_id.replace(/\s+/g, "");

    return record;
  }

  renderTitle(): JSX.Element {
    if (getUrlParam("recordId") == -1) {
      return <h2>New Customer</h2>;
    } else {
      return <h2>{this.state.record.name ? this.state.record.name : "[Undefined Customer Name]"}</h2>;
    }
  }

  onAfterFormInitialized(): void {
    request.get(
      'api/table/describe',
      {
        model: 'HubletoApp/Community/Contacts/Models/Contact',
        idPerson: -1,
      },
      (description: any) => {
        this.setState({tableContactsDescription: description} as FormCustomerState);
      }
    );
  }

  renderNewPersonForm(R: any): JSX.Element {
    return (
      <ModalSimple
        uid='person_form'
        isOpen={true}
        type='right wide'
      >
        <FormPerson
          id={-1}
          creatingNew={true}
          isInlineEditing={true}
          descriptionSource="both"
          tableContactsDescription={this.state.tableContactsDescription}
          description={{
            defaultValues: {
              id_customer: R.id
            }
          }}
          showInModal={true}
          showInModalSimple={true}
          onClose={() => { this.setState({ createNewPerson: false } as FormCustomerState); }}
          onSaveCallback={(form: FormPerson<FormPersonProps, FormPersonState>, saveResponse: any) => {
            if (saveResponse.status = "success") {
              this.setState({createNewPerson: false} as FormCustomerState)
              this.loadRecord()
            }
          }}
        >
        </FormPerson>
      </ModalSimple>
    )
  }

  renderActivityForm(R: any): JSX.Element {
    return (
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
              id_customer: R.id,
              date_start: this.state.activityCalendarDateClicked,
              time_start: this.state.activityCalendarTimeClicked == "00:00:00" ? null : this.state.activityCalendarTimeClicked,
              date_end: this.state.activityCalendarDateClicked,
            }
          }}
          showInModal={true}
          showInModalSimple={true}
          onClose={() => { this.setState({ showIdActivity: 0 } as FormCustomerState) }}
          onSaveCallback={(form: FormActivity<FormActivityProps, FormActivityState>, saveResponse: any) => {
            if (saveResponse.status == "success") {
              this.setState({ showIdActivity: 0 } as FormCustomerState);
            }
          }}
        ></FormActivity>
      </ModalSimple>
     )
  }

  renderNewLeadForm(R: any): JSX.Element {
    return (
      <ModalSimple
        uid='lead_form'
        isOpen={true}
        type='right'
      >
        <FormLead
          id={-1}
          isInlineEditing={true}
          descriptionSource="both"
          description={{
            defaultValues: {
              id_customer: R.id,
            }
          }}
          showInModal={true}
          showInModalSimple={true}
          onClose={() => { this.setState({ createNewLead: false } as FormCustomerState); }}
          onSaveCallback={(form: FormLead<FormLeadProps, FormLeadState>, saveResponse: any) => {
            if (saveResponse.status = "success") {
              console.log("hihi");

              this.loadRecord();
              this.setState({createNewLead: false} as FormCustomerState)
            }
          }}
        />
      </ModalSimple>
    )
  }

  renderNewDealForm(R: any): JSX.Element{
  return (
    <ModalSimple
      uid='deal_form'
      isOpen={true}
      type='right'
    >
      <FormDeal
        id={-1}
        isInlineEditing={true}
        descriptionSource="both"
        description={{
          defaultValues: {
            id_customer: R.id,
          }
        }}
        showInModal={true}
        showInModalSimple={true}
        onClose={() => { this.setState({ createNewDeal: false } as FormCustomerState); }}
        onSaveCallback={(form: FormDeal<FormDealProps, FormDealState>, saveResponse: any) => {
          if (saveResponse.status = "success") {
            this.loadRecord();
            this.setState({createNewDeal: false} as FormCustomerState)
          }
        }}
      />
    </ModalSimple>
  )
  }

  renderDocumentForm(): JSX.Element{
    return (
      <ModalSimple
        uid='document_form'
        isOpen={true}
        type='right'
      >
        <FormDocument
          id={this.state.showIdDocument}
          onClose={() => this.setState({showIdDocument: 0} as FormCustomerState)}
          showInModal={true}
          descriptionSource="both"
          description={{
            defaultValues: {
              creatingForModel: "HubletoApp/Community/Customers/Models/CustomerDocument",
              creatingForId: this.state.record.id,
              origin_link: window.location.pathname + "?recordId=" + this.state.record.id,
            }
          }}
          isInlineEditing={this.state.showIdDocument < 0 ? true : false}
          showInModalSimple={true}
          onSaveCallback={(form: FormDocument<FormDocumentProps, FormDocumentState>, saveResponse: any) => {
            if (saveResponse.status = "success") {
              this.loadRecord();
              this.setState({ showIdDocument: 0 } as FormCustomerState)
            }
          }}
          onDeleteCallback={(form: FormDocument<FormDocumentProps, FormDocumentState>, saveResponse: any) => {
            if (saveResponse.status = "success") {
              this.loadRecord();
              this.setState({ showIdDocument: 0 } as FormCustomerState)
            }
          }}
        />
      </ModalSimple>
    );
  }

  renderContent(): JSX.Element {
    const R = this.state.record;
    const showAdditional = R.id > 0 ? true : false;

    if (R.LEADS && R.LEADS.length > 0) {
      R.LEADS.map((lead, index) => {
        lead.checkOwnership = false;
        if (lead.DEAL) lead.DEAL.checkOwnership = false;
      })
    }
    if (R.DEALS && R.DEALS.length > 0) {
      R.DEALS.map((deal, index) => {
        deal.checkOwnership = false;
        if (deal.LEAD) deal.LEAD.checkOwnership = false;
      })
    }

    return (
      <>
        <TabView>
          <TabPanel header={this.translate('Customer')}>
            <div
              className="grid grid-cols-2 gap-1"
              style={{
                gridTemplateAreas: `
                  'customer customer'
                  'notes notes'
                  'contacts contacts'
                  'activities activities'
                `,
              }}
            >
              <div className="card" style={{ gridArea: "customer" }}>
                <div className="card-body flex flex-row gap-2">
                  <div className="w-1/2">
                    {this.inputWrapper("name")}
                    {this.inputWrapper("street_line_1")}
                    {this.inputWrapper("street_line_2")}
                    {this.inputWrapper("city")}
                    {this.inputWrapper("region")}
                    {this.inputWrapper("id_country")}
                    {this.inputWrapper("postal_code")}
                  </div>
                  <div className='border-l border-gray-200'></div>
                  <div className="w-1/2">
                    {this.inputWrapper("vat_id")}
                    {this.inputWrapper("customer_id")}
                    {this.inputWrapper("tax_id")}
                    {showAdditional ? this.inputWrapper("date_created") : null}
                    {this.inputWrapper("is_active")}
                    <FormInput title="Tags">
                      <InputTags2
                        {...this.getInputProps('color_tags')}
                        value={this.state.record.TAGS}
                        model="HubletoApp/Community/Settings/Models/Tag"
                        targetColumn="id_customer"
                        sourceColumn="id_tag"
                        colorColumn="color"
                        onChange={(value: any) => {
                          this.updateRecord({ TAGS: value });
                        }}
                      />
                    </FormInput>
                    {this.inputWrapper("id_user")}
                  </div>
                </div>
              </div>

              <div className="card card-body"  style={{ gridArea: "notes" }}>
                {this.inputWrapper("note")}
              </div>

              {showAdditional ?
                <div className="card" style={{ gridArea: "contacts" }}>
                  <div className="card-header">{this.translate('Contacts')}</div>
                  <div className="card-body">
                    <a
                      role="button"
                      onClick={() => {
                        if (!R.PERSONS) R.PERSONS = [];
                        this.setState({createNewPerson: true} as FormCustomerState);
                      }}>
                      + {this.translate('Add contact')}
                    </a>
                    <TablePersons
                      uid={this.props.uid + "_table_persons"}
                      parentForm={this}
                      isUsedAsInput={true}
                      readonly={!this.state.isInlineEditing}
                      customEndpointParams={{idCustomer: R.id}}
                      data={{ data: R.PERSONS }}
                      descriptionSource="props"
                      description={{
                        ui: {
                          addButtonText: this.translate('Add contact'),
                        },
                        permissions: this.props.tablePersonsDescription?.permissions ?? {},
                        columns: {
                          first_name: { type: "varchar", title: this.translate("First name") },
                          last_name: { type: "varchar", title: this.translate("Last name") },
                          virt_email: { type: "varchar", title: this.translate("Email"), },
                          virt_number: { type: "varchar", title: this.translate("Phone number") },
                        },
                        inputs: {
                          first_name: { type: "varchar", title: this.translate("First name") },
                          last_name: { type: "varchar", title: this.translate("Last name") },
                        },
                      }}
                      onRowClick={(table: TablePersons, row: any) => {
                        var tableProps = this.props.tablePersonsDescription
                        tableProps.idPerson = row.id;
                        table.onAfterLoadTableDescription(tableProps)
                        table.openForm(row.id);
                      }}
                      onChange={(table: TablePersons) => {
                        this.updateRecord({ PERSONS: table.state.data?.data });
                      }}
                      onDeleteSelectionChange={(table: TablePersons) => {
                        this.updateRecord({ PERSONS: table.state.data?.data ?? [] });
                      }}
                    ></TablePersons>

                    {this.state.createNewPerson ?
                      this.renderNewPersonForm(R)
                    : null}
                  </div>
                </div>
              : null}
            </div>
          </TabPanel>
          {showAdditional ? (
            <TabPanel header={this.translate('Calendar')}>
              <Calendar
                onCreateCallback={() => this.loadRecord()}
                readonly={R.is_archived}
                views={"timeGridDay,timeGridWeek,dayGridMonth,listYear"}
                eventsEndpoint={globalThis.main.config.rewriteBase + 'customers/get-calendar-events?idCustomer=' + R.id}
                onDateClick={(date, time, info) => {
                  this.setState({
                    activityCalendarDateClicked: date,
                    activityCalendarTimeClicked: time,
                    showIdActivity: -1,
                  } as FormCustomerState);
                }}
                onEventClick={(info) => {
                  this.setState({
                    showIdActivity: parseInt(info.event.id),
                  } as FormCustomerState);
                }}
              ></Calendar>
              {this.state.showIdActivity == 0 ? <></> :
                this.renderActivityForm(R)
              }
            </TabPanel>
          ) : null}
          {showAdditional ? (
            <TabPanel header={this.translate('Leads')}>
              <a
                role="button"
                onClick={() => {this.setState({ createNewLead: true } as FormCustomerState);}}>
                + Add Lead
              </a>
              <TableLeads
                uid={this.props.uid + "_table_leads"}
                data={{ data: R.LEADS }}
                descriptionSource="props"
                customEndpointParams={{idCustomer: R.id}}
                isUsedAsInput={false}
                readonly={!this.state.isInlineEditing}
                description={{
                  permissions: this.props.tableLeadsDescription.permissions,
                  columns: {
                    title: { type: "varchar", title: "Title" },
                    price: { type: "float", title: "Amount" },
                    id_currency: { type: "lookup", title: "Currency", model: 'HubletoApp/Community/Settings/Models/Currency' },
                    date_expected_close: { type: "date", title: "Expected Close Date" },
                  },
                  inputs: {
                    title: { type: "varchar", title: "Title" },
                    price: { type: "float", title: "Amount" },
                    id_currency: { type: "lookup", title: "Currency", model: 'HubletoApp/Community/Settings/Models/Currency' },
                    date_expected_close: { type: "date", title: "Expected Close Date" },
                  },
                }}
                onRowClick={(table: TableLeads, row: any) => {
                  var tableProps = this.props.tableLeadsDescription
                  tableProps.idLead = row.id;
                  table.onAfterLoadTableDescription(tableProps)
                  table.openForm(row.id);
                }}
                onDeleteSelectionChange={(table: TableLeads) => {
                  this.updateRecord({ LEADS: table.state.data?.data ?? [] });
                }}
              />
              {this.state.createNewLead == true ? (
                this.renderNewLeadForm(R)
              ): null}
            </TabPanel>
          ) : null}
          {showAdditional ? (
            <TabPanel header={this.translate('Deals')}>
              <a
                role="button"
                onClick={() => {this.setState({ createNewDeal: true } as FormCustomerState);}}>
                + Add Deal
              </a>
              <TableDeals
                uid={this.props.uid + "_table_deals"}
                data={{ data: R.DEALS }}
                descriptionSource="props"
                customEndpointParams={{idCustomer: R.id}}
                isUsedAsInput={false}
                readonly={!this.state.isInlineEditing}
                description={{
                  permissions: this.props.tableDealsDescription.permissions,
                  columns: {
                    title: { type: "varchar", title: "Title" },
                    price: { type: "float", title: "Amount" },
                    id_currency: { type: "lookup", title: "Currency", model: 'HubletoApp/Community/Settings/Models/Currency' },
                    date_expected_close: { type: "date", title: "Expected Close Date" },
                  },
                  inputs: {
                    title: { type: "varchar", title: "Title" },
                    price: { type: "float", title: "Amount" },
                    id_currency: { type: "lookup", title: "Currency", model: 'HubletoApp/Community/Settings/Models/Currency' },
                    date_expected_close: { type: "date", title: "Expected Close Date" },
                  },
                }}
                onRowClick={(table: TableDeals, row: any) => {
                  var tableProps = this.props.tableDealsDescription
                  tableProps.idLead = row.id;
                  table.onAfterLoadTableDescription(tableProps)
                  table.openForm(row.id);
                }}
                onDeleteSelectionChange={(table: TableDeals) => {
                  this.updateRecord({ DEALS: table.state.data?.data ?? [] });
                }}
              />
              {this.state.createNewDeal == true ? (
                this.renderNewDealForm(R)
              ): null}
            </TabPanel>
          ) : null}
          {showAdditional ? (
            <TabPanel header={this.translate('Documents')}>
              <div className="divider"><div><div><div></div></div><div><span>{this.translate('Shared documents')}</span></div></div></div>
              {this.inputWrapper('shared_folder', {readonly: R.is_archived})}
              <div className="divider"><div><div><div></div></div><div><span>{this.translate('Local documents')}</span></div></div></div>
              <a
                role="button"
                onClick={() => this.setState({showIdDocument: -1} as FormCustomerState)}
              >
                + Add Document
              </a>
              <TableCustomerDocuments
                uid={this.props.uid + "_table_deals"}
                data={{ data: R.DOCUMENTS }}
                descriptionSource="props"
                customEndpointParams={{idCustomer: R.id}}
                isUsedAsInput={true}
                readonly={!this.state.isInlineEditing}
                description={{
                  permissions: this.props.tableDocumentsDescription.permissions,
                  ui: {
                    showFooter: false,
                    showHeader: false,
                  },
                  columns: {
                    id_document: { type: "lookup", title: "Document", model: "HubletoApp/Community/Documents/Models/Document" },
                    hyperlink: { type: "varchar", title: "Link", cellRenderer: ( table: TableCustomerDocuments, data: any, options: any): JSX.Element => {
                      return (
                        <FormInput>
                          <Hyperlink {...this.getInputProps('document_link')}
                            value={data.DOCUMENT.hyperlink}
                            readonly={true}
                          ></Hyperlink>
                        </FormInput>
                      )
                    },},
                  },
                  inputs: {
                    id_document: { type: "lookup", title: "Document", model: "HubletoApp/Community/Documents/Models/Document" },
                    hyperlink: { type: "varchar", title: "Link", readonly: true},
                  },
                }}
                onRowClick={(table: TableCustomerDocuments, row: any) => {
                  this.setState({showIdDocument: row.id_document} as FormCustomerState);
                }}
              />
              {this.state.showIdDocument != 0 ?
                this.renderDocumentForm()
              : null}
            </TabPanel>
          ) : null}
        </TabView>
      </>
    );
  }
}
