import React, { useRef, useState, useMemo, JSX, useEffect, MouseEventHandler } from 'react';
import {
  GridComponent, Inject, ColumnMenu, ColumnChooser, RowDD, Freeze,
  InfiniteScroll, CommandColumn, ContextMenu, VirtualScroll, Filter, Search, LazyLoadGroup, Reorder, Resize, Sort, PdfExport,
  ExcelExport, Edit, Page, Toolbar, Group, ColumnsDirective, ColumnDirective,
  ExcelQueryCellInfoEventArgs,
  ContextMenuClickEventArgs,
  QueryCellInfoEventArgs,
  ColumnModel,
  BeforePasteEventArgs,
  CellSaveArgs,
  FilterSettingsModel,
  ToolbarItems,
  EditMode,
  ContextMenuItem,
  ContextMenuItemModel,
  SortSettingsModel,
  TextWrapSettingsModel,
  SelectionSettingsModel,
  parentsUntil,
  CommandModel,
  ValueType,
  AggregateTemplateContext,
  AggregateRowModel,
  AggregateType,
  CheckboxSelectionType,
  SelectionType,
  NewRowPosition,
  FilterType,
  FilterBarMode,
  IndicatorType,
  GridColumn,
  columnDrag,
  PageEventArgs,
  GroupEventArgs,
  FilterEventArgs,
  SearchEventArgs,
  SortEventArgs,
  AddEventArgs,
  SaveEventArgs,
  EditEventArgs,
  DeleteEventArgs,
  ActionEventArgs,
  NotifyArgs,
  ReorderEventArgs
} from '@syncfusion/ej2-react-grids';
import {
  Aggregate, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective
} from '@syncfusion/ej2-react-grids';
import { AsyncSettingsModel, ChangedEventArgs, FileInfo, NumericTextBox, RatingComponent, SuccessEventArgs, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs'
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { createElement, EmitType, Internationalization, isNullOrUndefined, setCulture, closest } from '@syncfusion/ej2-base';
import { AutoComplete, DdtSelectEventArgs, DropDownListComponent, DropDownTree, FieldSettingsModel } from '@syncfusion/ej2-react-dropdowns';
import { MenuComponent, MenuItemModel, SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent, CheckBox, CheckBoxComponent, ChipDirective, ChipListComponent, ChipsDirective } from '@syncfusion/ej2-react-buttons';
import { DatePicker } from '@syncfusion/ej2-react-calendars';
import { BeforeOpenEventArgs, DialogComponent, TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ListViewComponent, SelectEventArgs, Virtualization } from '@syncfusion/ej2-react-lists';
import { employeeDetails } from './datasource';
import arLocalization from './locale/ar.json';
import deLocalization from './locale/de.json';
import frLocalization from './locale/fr.json';
import zhLocalization from './locale/zh.json';
import './Material 3/Showcase Material3/style.css';
import './App.css';
import { L10n } from '@syncfusion/ej2-base';
import { ProgressBarComponent } from '@syncfusion/ej2-react-progressbar';
import { createRoot, Root } from 'react-dom/client';

loadLocalization();

function App() {
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [searchedCount, setSearchedCount] = useState<number>(0);
  const [addedCount, setAddedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [rowIndexValue, setRowIndexValue] = useState("0");
  const [cellIndexValue, setCellIndexValue] = useState("0");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [status, setStatus] = useState(false);
  const dropdownRefs = useRef<Record<string, DropDownListComponent>>({});
  const checkboxRefs = useRef<Record<string, CheckBoxComponent>>({});
  const checkRefs = useRef<Record<string, CheckBoxComponent>>({});
  const intl: Internationalization = new Internationalization();
  const tooltipRefs = useRef<{ [key: string]: TooltipComponent | null }>({});
  const [showDialog, setShowDialog] = useState(false);
  const selectedListItemRef = useRef<string>("Header Settings");
  const localization = useRef('en-US');
  const arabicStatus = useRef(false);
  const theme = useRef('material3');
  const displayMode = useRef('Mouse');
  const [isDialog, setIsDialog] = useState(false);
  let [searchText, setSearchText] = useState<string>('');
  let [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});
  let [expandCollapseValue, setExpandCollapseValue] = useState<string>("grouping");
  let [isExpand, setIsExpand] = useState(true);
  let [enableRtlListView, setenableRtlListView] = useState(false);
  let [selectedField, setSelectedField] = useState<string | null>(null);
  let [caseSensitiveChecked, setCaseSensitiveChecked] = useState<boolean>(false);
  let [ignoreAccentChecked, setIgnoreAccentChecked] = useState<boolean>(false);
  let [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  let [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>({});
  let selectedItemRef = useRef<{ text: string; id: string } | null>(null);
  let [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({});
  const [checkState, setCheckState] = useState<{ [key: string]: boolean }>({});
  let listFields = { id: "id", text: "text" };
  let menuFields: FieldSettingsModel = { text: 'text', value: 'id' };
  let root: Root | null = null; // 
  let showEditLabel: boolean = false;
  let batchFlag: boolean = false;
  let isHeaderTemplate: boolean = false;
  let startTime: number = new Date().getTime();
  let imageStream: string;
  let batchEdit: BatchOrders[] = [];
  let selectedValues: string[] = [];
  let dateElement: any;
  let numericElement: any;
  let dropdownTreeElement: any;
  let checkboxElement: any;
  let productIDInput: HTMLElement;
  let productNameInput: HTMLElement;
  let customerNameInput: HTMLElement;
  let customerMailIDInput: HTMLElement;
  let shipCountryInput: HTMLElement;
  let orderIDInput: HTMLElement;
  let textboxInstance: TextBoxComponent;
  let gridInstance: GridComponent;
  let chipStatus: ChipListComponent;
  let dialogInstance: DialogComponent;
  let dialogObj: DialogComponent;
  let listObj!: ListViewComponent;
  let uploadObj!: UploaderComponent;
  let previewRef!: HTMLElement | null;
  let sidebarobj = useRef(null);
  let selectedFilterType: string = "FilterBar";
  let selectedFilterBarMode: string = "OnEnter";
  let selectedIndicator: string = "Spinner";
  let selectedCheckMode: string = "Default";
  let selectionType: string = "Multiple";
  let selectNewRowPosition: string = "Top";
  let selectEditMode: string = "Normal";
  let filteredData;
  const orderIDRules: object = { required: true };
  const productIDRules: object = { required: true };
  const customerIDRules: object = { required: true };
  const emailIDRules: object = { required: true };
  const orderDateRules: object = { required: true };
  const freightIDRules: object = { required: true };
  const shipCountryRules: object = { required: true };

  const gridPrivateMethods = {

    localeChanged: (value: string): void => {
      localization.current = value as string;
      setCulture(value as string);
      arabicStatus.current = value === "ar";
      if (arabicStatus.current) {
        gridInstance.enableRtl = true;
        enableRtlListView = true;
      }
      else {
        enableRtlListView = enableRtlListView ? enableRtlListView : false;
        gridInstance.enableRtl = false;
      }
    },

    themeChanged: (value: string): void => {
      const path: string = 'https://cdn.syncfusion.com/ej2/29.1.33/' + value + '.css';
      const primaryThemeLink: HTMLLinkElement = document.querySelector('.theme-primary') as HTMLLinkElement;
      const body: HTMLElement = document.body;
      primaryThemeLink.href = path.toString();
      body.classList.remove(theme.current);
      body.classList.add(value as string);
      theme.current = value as string;
    },

    modeChanged: (value: string): void => {
      displayMode.current = value as string;
    },

    handleCheckboxChange: (id: string, checked: boolean) => {
      setCheckboxValues((prevValues) => {
        const newValues = {
          ...prevValues,
          [id]: checked,
        };
        return newValues;
      });
    },

    // Method to dynamically change dropdown values
    changeDropdownValue: (dropdownId: string, value: string) => {
      setDropdownValues((prevState) => {
        const newState = {
          ...prevState,
          [dropdownId]: value
        };
        dropdownValues = newState;
        return newState;
      });
    },

    handleClick: (value: string) => {
      setDropdownValues((prev) => {
        if (selectedListItemRef.current === "Selection Settings") {
          gridInstance.selectionSettings.checkboxMode = prev.checkboxmodedefault as CheckboxSelectionType;
          gridInstance.selectionSettings.type = prev.selectiontype as SelectionType;
        }
        else if (selectedListItemRef.current === "Edit Settings") {
          gridInstance.editSettings.newRowPosition = prev.newrowposition as NewRowPosition;
          gridInstance.editSettings.mode = prev.editmode as EditMode;
        }
        else if (selectedListItemRef.current === "Filter Settings") {
          gridInstance.filterSettings.type = prev.filtertype as FilterType;
          if (prev.filtertype === 'CheckBox' || prev.filtertype === 'Excel' || prev.filtertype === 'Menu') {
            let columns = gridInstance.getColumns();
            columns.forEach((col) => {
              if (col.field === 'OrderDate' || col.field === 'Freight' || col.field === 'ShipAddress' || col.field === 'Verified') {
                col.allowFiltering = false;
              }
            });
          }
          gridInstance.filterSettings.mode = prev.filterbarmode as FilterBarMode;
          gridInstance.filterSettings.loadingIndicator = prev.loadingindicator as IndicatorType;
        }
        else if (selectedListItemRef.current === "Web Standards") {
          localization.current = prev.localization;
          gridPrivateMethods.localeChanged(localization.current);
          theme.current = prev.theme;
          gridPrivateMethods.themeChanged(theme.current);
          displayMode.current = prev.interactiontypes;
          gridPrivateMethods.modeChanged(displayMode.current);
        }
        Object.keys(dropdownValues).forEach((prop) => {
          dropdownValues[prop] = prev[prop];
        });
        return prev;
      });
      setCheckboxValues((prev) => {
        if (selectedListItemRef.current === "Header Settings") {
          gridInstance.allowMultiSorting = prev.multisorting;
          gridInstance.allowSorting = prev.sorting;
          gridInstance.allowFiltering = prev.filtering;
          gridInstance.allowGrouping = prev.grouping;
          gridInstance.allowReordering = prev.reordering;
          gridInstance.allowResizing = prev.resizing;
        }
        else if (selectedListItemRef.current === "Selection Settings") {
          gridInstance.selectionSettings.allowColumnSelection = prev.columnselection;
          gridInstance.selectionSettings.checkboxOnly = prev.checkboxonly;
          gridInstance.selectionSettings.persistSelection = prev.persistselection;
          if (gridInstance.selectionSettings.checkboxMode === 'Default') {
            gridInstance.selectionSettings.enableSimpleMultiRowSelection = prev.simplemultirow;
          } else {
            gridInstance.selectionSettings.enableSimpleMultiRowSelection = false;
          }
          gridInstance.selectionSettings.enableToggle = prev.toggle;
        }
        else if (selectedListItemRef.current === "Edit Settings") {
          gridInstance.editSettings.allowAdding = prev.adding;
          gridInstance.editSettings.allowDeleting = prev.deleting;
          gridInstance.editSettings.allowEditOnDblClick = prev.editondoubleclick;
          gridInstance.editSettings.allowEditing = prev.editing;
          gridInstance.editSettings.allowNextRowEdit = prev.nextrowedit;
          gridInstance.editSettings.showConfirmDialog = prev.confirmdialog;
          gridInstance.editSettings.showDeleteConfirmDialog = prev.deletedialog;
        }
        else if (selectedListItemRef.current === "Filter Settings") {
          gridInstance.filterSettings.enableCaseSensitivity = prev.enablecasesensitivity;
          if (gridInstance.enableInfiniteScrolling) {
            gridInstance.infiniteScrollSettings = {
              enableCache: true, maxBlocks: 3, initialBlocks: 3
            };
            gridInstance.filterSettings.enableInfiniteScrolling = prev.enableinfinitescrolling;
          } else {
            gridInstance.filterSettings.enableInfiniteScrolling = prev.enableinfinitescrolling;
          }
          gridInstance.filterSettings.ignoreAccent = prev.ignoreaccent;
          gridInstance.filterSettings.showFilterBarOperator = prev.filterbar;
          gridInstance.filterSettings.showFilterBarStatus = prev.barstatus;
          if (gridInstance.filterSettings.showFilterBarStatus) {
            let columns = gridInstance.getColumns();
            columns.forEach((col) => {
              if (col.field === 'CustomerName') {
                col.filter = { operator: 'contains' };
              }
            });
          }
        }
        else if (selectedListItemRef.current === "Group Settings") {
          gridInstance.groupSettings.allowReordering = prev.reordering;
          gridInstance.groupSettings.showDropArea = prev.showdroparea;
          gridInstance.groupSettings.showGroupedColumn = prev.showgroupedcolumn;
          gridInstance.groupSettings.showToggleButton = prev.showtogglebutton;
          if (prev.showungroupbutton) {
            gridInstance.ungroupColumn('OrderID');
          } else if (prev.showdroparea && prev.showgroupedcolumn) {
            gridInstance.groupColumn('OrderID');
          }
        }
        else if (selectedListItemRef.current === "Grid Settings") {
          gridInstance.allowPaging = prev.paging;
          gridInstance.autoFit = prev.autofit;
          gridInstance.setGridPager(null as unknown as HTMLElement);
          //gridInstance.enableVirtualization = prev.paging ? false : true;
          gridInstance.enableVirtualization = prev.virtualization;
          gridInstance.showColumnMenu = prev.column_menu;
          gridInstance.allowTextWrap = prev.textwrap;
          gridInstance.autoFit = prev.autofit;
          gridInstance.enableAltRow = prev.altrow;
          if (gridInstance.enableAltRow) {
            gridInstance.enableAltRow = prev.altrow;
            let styleTag = document.getElementById("altrow-style") as HTMLStyleElement;
            if (prev.altrow) {
              if (!styleTag) {
                styleTag = document.createElement("style");
                styleTag.id = "altrow-style";
                document.head.appendChild(styleTag);
              }
              styleTag.innerHTML = `.e-grid .e-altrow { background-color: #B3F0E6 !important; }`;
            } else {
              if (styleTag) {
                styleTag.remove();
              }
            }
          }
          gridInstance.enableAutoFill = prev.autofill;
          if (gridInstance.enableAutoFill) {
            gridInstance.selectionSettings.cellSelectionMode = 'Box';
            gridInstance.selectionSettings.mode = 'Cell';
            gridInstance.editSettings.mode = 'Batch';
          } else {
            gridInstance.selectionSettings.cellSelectionMode = 'Flow';
            gridInstance.selectionSettings.mode = 'Both';
            gridInstance.editSettings.mode = 'Dialog';
          }
          gridInstance.allowExcelExport = prev.excelexport;
          const toolbarExcelItem = document.getElementById("export_excel");
          if (!prev.excelexport) {
            toolbarExcelItem!.classList.add("e-disabled");
            toolbarExcelItem!.setAttribute("disabled", "true");
          } else {
            toolbarExcelItem!.classList.remove("e-disabled");
            toolbarExcelItem!.removeAttribute("disabled");
          }
          gridInstance.allowPdfExport = prev.pdfexport;
          const toolbarPdfItem = document.getElementById("export_pdf");
          if (!prev.pdfexport) {
            toolbarPdfItem!.classList.add("e-disabled");
            toolbarPdfItem!.setAttribute("disabled", "true");
          } else {
            toolbarPdfItem!.classList.remove("e-disabled");
            toolbarPdfItem!.removeAttribute("disabled");
          }
          gridInstance.allowRowDragAndDrop = prev.draganddrop;
          if (prev.draganddrop) {
            let columns = gridInstance.getColumns();
            columns.forEach((col) => {
              if (col.headerText === 'Commands' || col.field === 'Rating') {
                col.freeze = 'None';
              }
            });
          } else {
            let columns = gridInstance.getColumns();
            columns.forEach((col) => {
              if (col.headerText === 'Commands' || col.field === 'Rating') {
                col.freeze = 'Right';
              }
            });
          }
          gridInstance.allowSelection = prev.selection;
          gridInstance.enableHover = prev.hover;
          gridInstance.enableInfiniteScrolling = prev.enableinfinitescrolling;
        }
        else if (selectedListItemRef.current === "Web Standards") {
          if (!arabicStatus.current) {
            enableRtlListView = prev.rtl;
            dialogObj.enableRtl = prev.rtl;
            gridInstance.enableRtl = prev.rtl;
            listObj.enableRtl = prev.rtl;
          }
          Object.keys(dropdownRefs.current).forEach((key) => {
            dropdownRefs.current[key].enableRtl = prev.rtl;
          });
          Object.keys(checkboxRefs.current).forEach((key) => {
            checkboxRefs.current[key].enableRtl = prev.rtl;
          });
        }
        Object.keys(checkboxValues).forEach((prop) => {
          checkboxValues[prop] = prev[prop];
        });
        return prev;
      });

      if (value === "Save") {
        dialogObj?.hide();
      }
    },

    sortComparer: (reference: ValueType, comparer: ValueType): number => {
      if (typeof reference === "string" && typeof comparer === "string") {
        return reference.localeCompare(comparer);
      }
      if (typeof reference === "number" && typeof comparer === "number") {
        return reference - comparer;
      }
      if (reference instanceof Date && comparer instanceof Date) {
        return reference.getTime() - comparer.getTime();
      }
      if (typeof reference === "boolean" && typeof comparer === "boolean") {
        return Number(reference) - Number(comparer);
      }
      return 0;
    },
  };

  const dropdownDataSource = {
    filterBarTypeOptions: [
      { value: "Menu", text: "Menu" },
      { value: "CheckBox", text: "CheckBox" },
      { value: "Excel", text: "Excel" },
      { value: "FilterBar", text: "FilterBar" }
    ],
    shipCountryData: [
      { text: 'Germany', value: 'Germany' },
      { text: 'France', value: 'France' },
      { text: 'Brazil', value: 'Brazil' },
      { text: 'Belgium', value: 'Belgium' },
      { text: 'Switzerland', value: 'Switzerland' },
      { text: 'Venezuela', value: 'Venezuela' },
      { text: 'Austria', value: 'Austria' },
      { text: 'Mexico', value: 'Mexico' },
    ] as object[],
    columnFields: [
      'OrderID', 'EmployeeID', 'CustomerID', 'CustomerName', 'ShipAddress', 'ProductName', 'ProductID',
      'Quantity', 'Freight', 'orderDate', 'ShipCountry', 'Verified', 'ShipedDate', 'Rating', 'ShipName'
    ],

    listViewData: [
      { text: 'Header Settings', id: 'list-01' },
      { text: 'Grid Settings', id: 'list-02' },
      { text: 'Group Settings', id: 'list-03' },
      { text: 'Filter Settings', id: 'list-04' },
      { text: 'Selection Settings', id: 'list-05' },
      { text: 'Edit Settings', id: 'list-06' },
      { text: 'Web Standards', id: 'list-07' }
    ],
    indicators: [
      { value: "Spinner", text: "Spinner" },
      { value: "Shimmer", text: "Shimmer" }
    ],

    selectiontype: [
      { value: "Single", text: "Single" },
      { value: "Multiple", text: "Multiple" }
    ],

    checkboxmode: [
      { value: "Default", text: "Default" },
      { value: "ResetOnRowClick", text: "ResetOnRowClick" }
    ],


    newRowPosition: [
      { value: "Top", text: "Top" },
      { value: "Bottom", text: "Bottom" }
    ],

    editMode: [
      { value: "Normal", text: "Normal", isDisabled: false },
      { value: "Dialog", text: "Dialog", isDisabled: false },
      { value: "Batch", text: "Batch", isDisabled: false }
    ],

    editModeModified: [
      { value: "Normal", text: "Normal", isDisabled: false },
      { value: "Dialog", text: "Dialog", isDisabled: false }
    ],


    filterBarModeOptions: [
      { value: "OnEnter", text: "OnEnter" },
      { value: "Immediate", text: "Immediate" }
    ],

    modeData: [
      { text: 'Mouse', value: 'Mouse' },
      { text: 'Touch', value: 'Touch' },
    ] as KeyDataType[],

    themeData: [
      { text: 'Material3', value: 'material3' },
      { text: 'Material3 Dark', value: 'material3-dark' },
      { text: 'Fluent', value: 'fluent' },
      { text: 'Fluent Dark', value: 'fluent-dark' },
      { text: 'Bootstrap5', value: 'bootstrap5' }
    ],
    localizationData: [
      { text: 'English', value: 'en-US', image: 'https://ej2.syncfusion.com/javascript/demos/src/tree-grid/images/USA.png' },
      { text: 'Germany', value: 'de', image: 'https://ej2.syncfusion.com/javascript/demos/src/tree-grid/images/Germany.png' },
      { text: 'French', value: 'fr', image: 'France-16.jpg' },
      { text: 'Arabic', value: 'ar', image: 'UAE-16.jpg' },
      { text: 'Chinese', value: 'zh', image: 'China-16.jpg' }
    ]
  };

  const gridCommonTemplates = {

    emptyMessageTemplate() {
      let srcImage: string = '';
      if (document.body.classList.value.indexOf('dark') > -1 || document.body.classList.value.indexOf('highcontrast') > -1) {
        srcImage = "emptyRecordTemplate_dark.svg";
      } else {
        srcImage = "emptyRecordTemplate_light.svg";
      }
      return (<div className='emptyRecordTemplate'>
        <img src={srcImage} className="e-emptyRecord" alt="No record" />
        <span>There is no data available to display at the moment.</span>
      </div>);
    },

    productTemplate(props: any) {
      const customerName = props.CustomerName;
      return (
        <div>
          <a
            href={`/product-details/${customerName}`}
            target="_blank"
            style={{ textDecoration: 'none', color: 'blue' }}
          >
            {props.ProductID}
          </a>
        </div>
      );
    },

    columnMenuSettings: () => {
      return (
        <div className='iconAlignment'>
          <span className="e-icons e-user icon" style={{ marginTop: '-2px' }}></span> Customer Details
        </div>
      )
    },

    columnClipModeSettings: (column: GridColumn) => {
      const align = column.headerTextAlign;
      const justify =
        align === 'Right' ? 'flex-end' :
          align === 'Center' ? 'center' : 'flex-start';
      return (
        <div className='settingsIconAlignment'>
          <div className='settingsIconText' style={{ justifyContent: justify }}>
            <div>Ship Address</div>
          </div>
          <span style={{
            ...(enableRtlListView
              ? { marginLeft: '-68px' }
              : { marginLeft: '-8px', marginRight: '-30px' }
            )
          }}>
            <MenuComponent
              items={menuItemProperties.columnMenuProperties}
              fields={menuFields}
              enableRtl={enableRtlListView}
              template={menuItemTemplates.menuSwitchTemplate}
              showItemOnClick={true}
              select={() => {
                isHeaderTemplate = true;
              }}
              cssClass="custom-menu-column-clipmode"
            />
          </span>
        </div>
      )
    },

    columnMenuFreezeSettings: () => {
      return (
        <div>

          <MenuComponent
            items={menuItemProperties.columnMenuFreezeProperties}
            fields={menuFields}
            enableRtl={enableRtlListView}
            template={menuItemTemplates.menuSwitchTemplate}
            showItemOnClick={true}
            select={() => { isHeaderTemplate = true; }}
            cssClass="custom-menu-column-name"
          />
          Order ID
        </div>
      )
    },

    columnMenuCheckboxSettings: (column: GridColumn) => {
      const align = column.headerTextAlign;
      const justify =
        align === 'Right' ? 'flex-end' :
          align === 'Center' ? 'center' : 'flex-start';
      return (
        <div className='settingsIconAlignment'>
          <div className='settingsIconText' style={{ justifyContent: justify }}>
            <span className="e-icons e-check-box icon"></span>
            <div>Verified</div>
          </div>
          <span style={{
            ...(enableRtlListView
              ? { marginLeft: '-35px', marginRight: '-43px' }
              : { marginLeft: '-45px', marginRight: '-30px' }
            )
          }}>
            <MenuComponent
              items={menuItemProperties.columnMenuCheckboxProperties}
              template={menuItemTemplates.menuSwitchTemplate}
              enableRtl={enableRtlListView}
              showItemOnClick={true}
              select={(args) => {
                isHeaderTemplate = true;
              }}
              cssClass="custom-menu-column-verified"
            /></span>
        </div>
      )
    },

    columnMenuDateFormatSettings: (column: GridColumn) => {
      const align = column.headerTextAlign;
      const justify =
        align === 'Right' ? 'flex-end' :
          align === 'Center' ? 'center' : 'flex-start';
      return (
        <div className='settingsIconAlignment'>
          <div className='settingsIconText' style={{ justifyContent: justify }}>
            <span className="e-icons e-day icon"></span>
            <div>Order Date</div>
          </div>
          <span style={{
            ...(enableRtlListView
              ? { marginLeft: '-37px', marginRight: '-6px' }
              : { marginLeft: '-8px', marginRight: '-30px' }
            )
          }}>
            <MenuComponent
              items={menuItemProperties.columnMenuDateFormatProperties}
              fields={menuFields}
              enableRtl={enableRtlListView}
              template={menuItemTemplates.menuSwitchTemplate}
              showItemOnClick={true}
              select={(args) => {
                isHeaderTemplate = true;
              }}
              cssClass="custom-menu-column-date"
            />
          </span>
        </div>
      )
    },

    columnMenuFormatSettings: (column: GridColumn) => {
      const align = column.headerTextAlign;
      const justify =
        align === 'Right' ? 'flex-end' :
          align === 'Center' ? 'center' : 'flex-start';
      return (
        <div className='settingsIconAlignment'>
          <div className='settingsIconText' style={{ justifyContent: justify }}>
            <span className="sf-icon-freight"></span>
            <div>Freight</div>
          </div>
          <span style={{
            ...(enableRtlListView
              ? { marginLeft: '-39px', marginRight: '-6px' }
              : { marginLeft: '-8px', marginRight: '-30px' }
            )
          }}>
            <MenuComponent
              items={menuItemProperties.columnMenuFormatProperties}
              fields={menuFields}
              enableRtl={enableRtlListView}
              template={menuItemTemplates.menuSwitchTemplate}
              showItemOnClick={true}
              select={() => {
                isHeaderTemplate = true;
              }}
              cssClass="custom-menu-column-number"
            />
          </span>
        </div>
      )
    },

    localeValueTemplate: (data: any) => {
      return (<div style={{ marginTop: "5px" }}><span><img style={{ width: '16px', height: '12px' }} className="country_image" src={data.image} alt={data.text} /><span> &nbsp;&nbsp; {data.text}</span></span></div>);
    },

    localizationFlagTemplate: (data: any) => {
      return (
        <span><img style={{ width: '16px', height: '12px' }} className="country_image" src={data.image} alt={data.text} /><span> &nbsp;&nbsp; {data.text}</span></span>
      );
    },

    selectItem: () => {
      if (selectedItemRef.current && listObj) {
        listObj.selectItem({ id: selectedItemRef.current.id });
      }
    },

    listTemplate: (data: any) => {
      return (<div id="sidebarList">
        <span className="text e-text-content" id={data.text} >{data.text}</span>
      </div>);
    },

    OnSelect: (args: SelectEventArgs) => {
      const selectedItem = (args.data as any).text || "Header Settings";
      selectedListItemRef.current = selectedItem;
      const listContent = document.getElementById("listContent");
      const newContent = customComponentTemplates.addPropertiesInsideDialogbox(selectedItem);
      if (listContent !== null && newContent !== null) {
        root = createRoot(listContent);
        root.render(newContent);
      }
    },

    sideBar: (): JSX.Element => {
      return (
        <div id="sblist-wrapper" className="control-section">
          <div id="sidelistwrapper">
            <div className="listmaincontent">
              <div>
                <div id="listContent" className="listcontent">
                  {customComponentTemplates.addPropertiesInsideDialogbox("Header Settings")}
                </div>
              </div>
            </div>
          </div>
          <SidebarComponent id="listSidebar" ref={sidebarobj} enableDock={true}
            dockSize="0px" className="sidebar-list" width="350px" target=".listmaincontent" type="Auto" isOpen={true}>
            <ListViewComponent id="listSidebarList" enableRtl={enableRtlListView} ref={(list: any) => listObj = list} dataSource={dropdownDataSource.listViewData} cssClass="e-template-list" height="451px" template={gridCommonTemplates.listTemplate} fields={listFields} select={gridCommonTemplates.OnSelect}>
              <Inject services={[Virtualization]} />
            </ListViewComponent>
          </SidebarComponent>
        </div>
      );
    },

    dialogObjOpen: () => {
      setShowDialog(true);
      gridCommonTemplates.selectItem();
      const indicatorElement = document.getElementById("loadingindicator");
      const infinitescrollingElement = document.getElementById("enableinfinitescrolling");
      if (gridInstance.filterSettings.type === "FilterBar" || gridInstance.filterSettings.type === "Menu") {
        indicatorElement!.classList.add("e-disabled");
        indicatorElement!.setAttribute("disabled", "true");
        infinitescrollingElement!.classList.add("e-disabled");
        infinitescrollingElement!.setAttribute("disabled", "true");
      }
    },

    dialogObjClose: () => {
      if (selectedItemRef.current && listObj) {
        listObj.unselectItem(selectedItemRef.current);
        console.log("Restored Selected Item:", selectedItemRef.current.text);
      }
      setShowDialog(false);
    },

    footerTemplate: () => {
      return (
        <div className='dialog-footer' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonComponent cssClass="e-link" onClick={() => gridPrivateMethods.handleClick('Save')}>
            Save
          </ButtonComponent>
          <ButtonComponent cssClass="e-link" onClick={() => gridPrivateMethods.handleClick('Apply')}>
            Apply
          </ButtonComponent>
        </div>
      );
    },


    HeaderTemplate: (): JSX.Element => {
      return (
        <div><span style={{ fontSize: '16px' }} className='e-icons e-settings icon'></span>
          <DialogComponent
            id="example_dialog"
            ref={(dialog: any) => dialogObj = dialog}
            enableRtl={enableRtlListView}
            visible={showDialog}
            isModal={true}
            header="Settings"
            height='100%'
            width='720px'
            content={gridCommonTemplates.sideBar}
            open={gridCommonTemplates.dialogObjOpen}
            close={gridCommonTemplates.dialogObjClose}
            footerTemplate={gridCommonTemplates.footerTemplate as any}
            showCloseIcon={true}
          >
          </DialogComponent>
        </div>);
    },

    customerDetailsTemplate: () => {
      return (
        <div className='iconAlignment'>
          <span className="e-icons e-user icon" style={{ marginTop: '-2px' }}></span> Customer Details
        </div>
      )
    },

    productDetailsTemplate: () => {
      return (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
          <span className="sf-icon-order-details"></span> &nbsp;
          <span>Product Details</span>
        </div>
      )
    },

    shipCountryTemplate: () => {
      return (
        <div className="Mapimage" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src="https://ej2.syncfusion.com/react/demos/src/grid/images/Map.png" className="e-image" style={{ display: 'flex', alignItems: 'center' }} alt="Marker" />&nbsp;
          Ship Country
        </div>
      )
    },

    getCountryMessage: (shipCountry: string) => {
      switch (shipCountry) {
        case 'France':
          return 'France.jpg';
        case 'Germany':
          return 'https://ej2.syncfusion.com/javascript/demos/src/tree-grid/images/Germany.png';
        case 'Brazil':
          return 'https://ej2.syncfusion.com/react/demos/src/grid/images/country/Brazil.png';
        case 'Spain':
          return 'https://ej2.syncfusion.com/react/demos/src/grid/images/country/Spain.png';
        case 'Switzerland':
          return 'https://ej2.syncfusion.com/react/demos/src/grid/images/country/Switzerland.webp';
        case 'Italy':
          return 'https://ej2.syncfusion.com/react/demos/src/grid/images/country/Italy.png';
        default:
          return 'https://ej2.syncfusion.com/javascript/demos/src/tree-grid/images/USA.png';
      }
    },

    countryTemplate: (props: Orders): JSX.Element => {
      let countryImage = gridCommonTemplates.getCountryMessage(props.ShipCountry);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={countryImage} alt={props.ShipCountry} style={{ width: '24px', height: '16px' }} />
          <span>{props.ShipCountry}</span>
        </div>
      );
    },

    orderDetailsTemplate: () => {
      return (
        <div className='templateText'>
          <span className="sf-icon-order-details"></span> &nbsp;
          <span>Order Details</span>
        </div>
      )
    },

    shippingDetailsTemplate: () => {
      return (
        <div className='templateText'>
          <span className="sf-icon-order-details"></span> &nbsp;
          <span>Shipping Information</span>
        </div>
      )
    },


    imageTemplate: (props: Orders): JSX.Element => {
      let imageIndex: number = props.EmployeeID % 9;
      imageIndex = imageIndex === 0 ? 1 : imageIndex;
      const altImg: number = !isNullOrUndefined(props.EmployeeID) ? props.EmployeeID : imageIndex;
      const isBase64String: boolean = !isNullOrUndefined(props) && !isNullOrUndefined(props.EmployeeImage)
        && props.EmployeeImage.indexOf("data:application") === -1 ? false : true;
      const matchingBatchEdit: BatchOrders = batchEdit.find((edit) => edit.orderID === props.OrderID) as BatchOrders;
      const src: string = matchingBatchEdit ? matchingBatchEdit.employeeImage : !isBase64String ? "data:image/jpeg;base64," + props.EmployeeImage
        : props.EmployeeImage ? !batchFlag ? 'https://ej2.syncfusion.com/react/demos/src/grid/images/' + imageIndex + '.png' : props.EmployeeImage : '';
      return (
        <div className="image-container">
          <img src={src} alt={altImg.toString()} className="profile-image" />
        </div>
      );
    },

    getBase64: (file: File): string => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        imageStream = reader.result as string;
      };
      return imageStream;
    },

    path: {
      saveUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Save',
      removeUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Remove',
    } as AsyncSettingsModel,

    onupload: (args: any) => {
      for (const i of args.filesData) {
        const liparentDiv = createElement('div', { className: 'image-list' });
        const liImage = createElement('img', { className: 'image' });
        liparentDiv.appendChild(liImage);
        gridCommonTemplates.readURL(liImage, i);
        previewRef!.appendChild(liparentDiv);

        const fileBlob: Blob = (args.filesData[0] as FileInfo).rawFile as Blob;
        const file: File = new File([fileBlob], (args.filesData[0] as FileInfo).name);
        imageStream = gridCommonTemplates.getBase64(file);
        batchFlag = true;
      }
    },

    readURL: (liImage: any, file: any) => {
      const imgPreview = liImage;
      const imageFile = file.rawFile;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        imgPreview.src = reader.result;
      }, false);
      if (imageFile) {
        reader.readAsDataURL(imageFile);
      }
    },

    uploaderEditTemplate: (): JSX.Element => {
      return (
        <div >
          {showEditLabel && (
            <div style={{ paddingBottom: '10px' }}>
              <label style={{ color: '#9b9696', fontSize: '12px' }}>Customer Image</label>
            </div>
          )}
          <div id="upload" ref={(previewEle: any) => previewRef = previewEle}>
            <UploaderComponent id='deffaultUpload' multiple={false} ref={(upload: any) => { uploadObj = upload; }} asyncSettings={gridCommonTemplates.path} selected={gridCommonTemplates.onupload} locale={'en-US'} allowedExtensions='.png, .jpg, .jpeg' />
          </div>
        </div>
      )
    }
  };

  const gridAggregateTemplates = {

    aggregateCustomization: (text: string) => {
      return (props: AggregateTemplateContext) => {
        const { Sum, Average, Min, Max, Count } = props as {
          Sum?: number;
          Average?: number;
          Min?: number;
          Max?: number;
          Count?: number;
        };
        const aggregationValue =
          Sum ?? Average ?? Min ?? Max ?? Count ?? 'N/A';
        return (
          <div id='aggregate-menu' style={{ display: 'inline-flex' }}>
            <MenuComponent
              items={text === 'footer' ? menuItemProperties.aggregateValues : menuItemProperties.aggregateGroupValues}
              fields={menuFields}
              enableScrolling={true}
              enableRtl={enableRtlListView}
              template={menuItemTemplates.menuSwitchTemplate}
              showItemOnClick={true}
              cssClass="footer-sum"
              beforeOpen={(e) => {
                if (e.parentItem.text === 'Sum' || e.parentItem.text === 'Average' || e.parentItem.text === 'Min' || e.parentItem.text === 'Max' || e.parentItem.text === 'Count') {
                  (closest(e.element, '.e-menu-wrapper') as HTMLElement).style.height = '160px';
                }
              }}
              select={(e) => {
                const selectedText = e.item.text;
                const aggregateValues = text === 'footer' ?  menuItemProperties.aggregateValues[0] : 
                menuItemProperties.aggregateGroupValues[0];
                // Update outer text
                aggregateValues.text = selectedText;
                // Update checkbox selections
                aggregateValues.items.forEach(item => {
                  item.checkbox = (item.text === selectedText);
                });
              }}
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#1C1B1F', fontSize: '14px', fontWeight: 'bold' }}>
                &nbsp; : &nbsp;
                <span style={{ color: '#B3261E', fontSize: '14px', fontWeight: '700' }}>
                  {aggregationValue}
                </span>
              </span>
            </div>
          </div>
        )
      }
    },

    GroupSummaryCalculation: (args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        let aggregates: AggregateRowModel[] = gridInstance.aggregates as AggregateRowModel[];
        if (aggregates.length > 0 && aggregates[1].columns && aggregates[1].columns.length > 0) {
          aggregates[1].columns[0].type = data.properties.text;
          aggregates[1].columns[0].groupFooterTemplate = gridAggregateTemplates.aggregateCustomization('groupFooter');
        }
      }
    },

    SummaryCalculation: (args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        let aggregates: AggregateRowModel[] = gridInstance.aggregates as AggregateRowModel[];
        if (aggregates.length > 0 && aggregates[0].columns && aggregates[0].columns.length > 0) {
          aggregates[0].columns[0].type = data.properties.text;
          aggregates[0].columns[0].footerTemplate = gridAggregateTemplates.aggregateCustomization('footer');
        }
      }
    },

    footerCountTemplate: (props: AggregateTemplateContext): JSX.Element => {
      return (
        <div className='templateText'>
          <span className="sf-icon-shopping-cart" style={{ fontSize: '18px' }}></span>
          <span style={{ color: '#1C1B1F', fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
            Total Orders:
            <span style={{ color: '#B3261E', fontSize: '14px', fontWeight: '700', marginLeft: '5px' }}>
              {(props as { Count?: number }).Count}
            </span>
          </span>
        </div>
      )
    },

    footerAvgTemplate: (props: any): JSX.Element => {
      const displayValue = props.Average === " " || isNullOrUndefined(props.Average) ? 0 : Number(props.Average).toFixed(1);
      return <div style={{ textAlign: 'center' }}><span style={{ color: '#1C1B1F', fontSize: '14px', fontWeight: '700' }}>Avg Rating: &nbsp;<span style={{ color: '#B3261E', fontSize: '14px', fontWeight: '700' }}>{displayValue}</span></span></div>;
    },

    groupCaptionMaxTemplate: (props: AggregateTemplateContext): JSX.Element => {
      return (<div>
        <span className='groupCaptionMinText'>
          Min
        </span>
        <span> ${((props as { Min?: number }).Min ?? 0).toFixed(2)}</span> &nbsp; &nbsp;
        <span className='groupCaptionMaxText'>
          Max
        </span>
        <span> ${((props as { Max?: number }).Max ?? 0).toFixed(2)}</span>
      </div>);
    }

  };

  const menuItemMethods = {
    gridLineValueChange: (args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        gridInstance.gridLines = data.properties.text;
      }
    },

    htmlEncodeChange: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.headerText === 'Order ID') {
            if (args.checked) {
              col.disableHtmlEncode = false;
            } else {
              col.disableHtmlEncode = true;
            }
          }
        });
        gridInstance.refreshColumns();
      }

    }),

    enableCheckBoxChange: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.field === 'Verified') {
            col.displayAsCheckBox = args.checked;
          }
        });
        gridInstance.refreshColumns();
      }
    }),

    hideSpecifiedColumn: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.headerText === 'Verified') {
            col.visible = args.checked;
            gridInstance.refreshColumns();
          }
        });
      }

    }),

    singleColumnSettingsTextWrap: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        gridInstance.allowTextWrap = args.checked;
      }
    }),

    singleColumnSettingsClipMode: ((args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.field === "ShipAddress") {
            col.clipMode = data.properties.text;
            gridInstance.refreshColumns();
          }
        });
      }
    }),

    frozenChange: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.headerText === 'Order ID') {
            if (args.checked) {
              col.isFrozen = true;
            } else {
              col.isFrozen = false;
            }
          }
        });
      }
    }),

    singleColumnSettingsFreeze: ((args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.headerText === "Commands" && data.properties.text === 'Right') {
            col.freeze = data.properties.text;
            gridInstance.refreshColumns();
          }
        });
      }
    }),

    singleColumnSettingsDateFormat: ((args: ChangeEventArgs, data: any) => {
      let columns = gridInstance.getColumns();
      columns.forEach((col) => {
        if (col.field === 'OrderDate') {
          col.format = data.properties.text;
          gridInstance.refreshColumns();
        }
      });
    }),

    singleColumnSettingsHeaderTextAlign: ((args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.field === "Freight") {
            col.headerTextAlign = data.properties.text;
          }
        });
        gridInstance.refreshColumns();
      }
    }),

    singleColumnSettingsCellTextAlign: ((args: ChangeEventArgs, data?: any) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.field === "Freight") {
            col.textAlign = data.properties.text;
          }
        });
        gridInstance.refreshColumns();
      }
    }),

    enableColumnEditing: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12) {
            col.allowEditing = args.checked;
          }
        });
      }
    }),

    enableColumnFiltering: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12) {
            col.allowFiltering = args.checked;
          }
        });
      }
    }),

    enableColumnGrouping: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12 || col.index === 15) {
            col.allowGrouping = args.checked;
          }
        });
      }
    }),

    enableColumnReordering: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12) {
            col.allowReordering = args.checked;
          }
        });
      }
    }),

    enableColumnResize: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12 || col.index === 15) {
            col.allowResizing = args.checked;
          }
        });
      }
    }),

    enableColumnSearching: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12) {
            col.allowSearching = args.checked;
          }
        });
      }
    }),

    enableColumnSorting: ((args: ChangeEventArgs) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.index === 12 || col.index === 15) {
            col.allowSorting = args.checked;
          }
        });
      }
    }),


    singleColumnSettingsFormat: ((args: ChangeEventArgs, data: any) => {
      if (gridInstance) {
        let columns = gridInstance.getColumns();
        columns.forEach((col) => {
          if (col.field === 'Freight') {
            col.format = data.properties.text;
            gridInstance.refreshColumns();
          }
        });

        const aggregateColumns = gridInstance.aggregates[0].columns;
        aggregateColumns?.forEach((col) => {
          if (col.field === "Freight") {
            col.format = data.properties.text;
          }
        });
      }
    }),


    handleFilterTypeChange: (value: any, dropRef: any) => {
      const filterbarElement = document.getElementById("filterbar");
      const barstatusElement = document.getElementById("barstatus");
      const filterbarmodeElement = document.getElementById("filterbarmode");
      const indicatorElement = document.getElementById("loadingindicator");
      const infinitescrollingElement = document.getElementById("enableinfinitescrolling");
      let filterbarCheckElement = filterbarElement?.querySelector('.e-checkbox-wrapper');
      let barStatusCheckElement = barstatusElement?.querySelector('.e-checkbox-wrapper');
      let infinitescrollingCheckElement = infinitescrollingElement?.querySelector('.e-checkbox-wrapper');

      if (value === "Menu" || value === "Excel" || value === "CheckBox") {
        filterbarCheckElement!.classList.add("e-checkbox-disabled");
        filterbarCheckElement!.setAttribute("disabled", "true");
        barStatusCheckElement!.classList.add("e-checkbox-disabled");
        barStatusCheckElement!.setAttribute("disabled", "true");
        dropRef['filterbarmode'].enabled = false;
        filterbarmodeElement!.classList.add("e-disabled");
        filterbarmodeElement!.setAttribute("disabled", "true");
        if (value === "Excel" || value === "CheckBox") {
          dropRef['loadingindicator'].enabled = true;
          indicatorElement!.classList.remove("e-disabled");
          indicatorElement!.removeAttribute("disabled");
          infinitescrollingCheckElement!.classList.remove("e-checkbox-disabled");
          infinitescrollingCheckElement!.removeAttribute("disabled");
        } else {
          if (value === "Menu") {
            dropRef['loadingindicator'].enabled = false;
            indicatorElement!.classList.add("e-disabled");
            indicatorElement!.setAttribute("disabled", "true");
            infinitescrollingCheckElement!.classList.add("e-checkbox-disabled");
            infinitescrollingCheckElement!.setAttribute("disabled", "true");
          }
        }
      } else {
        filterbarCheckElement!.classList.remove("e-checkbox-disabled");
        filterbarCheckElement!.removeAttribute("disabled");
        barStatusCheckElement!.classList.remove("e-checkbox-disabled");
        barStatusCheckElement!.removeAttribute("disabled");
        dropRef['filterbarmode'].enabled = true;
        filterbarmodeElement!.classList.remove("e-disabled");
        filterbarmodeElement!.removeAttribute("disabled");
        if (value === "FilterBar") {
          dropRef['loadingindicator'].enabled = false;
          indicatorElement!.classList.add("e-disabled");
          indicatorElement!.setAttribute("disabled", "true");
          infinitescrollingCheckElement!.classList.add("e-checkbox-disabled");
          infinitescrollingCheckElement!.setAttribute("disabled", "true");
        }

      }
    },


    disableDropdownItem: (data: any, dropRef: any, id: string) => {
      if (gridInstance.enableVirtualization || gridInstance.enableInfiniteScrolling) {
        dropRef["editmode"].dataSource = dropdownDataSource.editModeModified;
        dropRef["newrowposition"].enabled = false;
      } else {
        dropRef["editmode"].dataSource = dropdownDataSource.editMode;
        dropRef["newrowposition"].enabled = true;
      }
    },

    selectionTypeChange: (value: any, dropRef: any) => {
      const selectionTypeItems = document.getElementById("simplemultirow");
      const checkboxSelection = document.getElementById("checkboxonly");

      const simpleMultiRowCheckbox = selectionTypeItems?.querySelector('.e-checkbox-wrapper') as HTMLElement;
      const simpleMultiRowInput = selectionTypeItems?.querySelector('input[type="checkbox"]') as any;

      const checkboxOnlyCheckbox = checkboxSelection?.querySelector('.e-checkbox-wrapper') as HTMLElement;
      const checkboxOnlyInput = checkboxSelection?.querySelector('input[type="checkbox"]') as HTMLInputElement;

      const disableCheckbox = (checkbox: HTMLElement | null, input: HTMLInputElement | null) => {
        checkbox?.classList.add("e-checkbox-disabled");
        checkbox?.setAttribute("disabled", "true");
        if (input) input.checked = false; // uncheck if disabled
      };

      const enableCheckbox = (checkbox: HTMLElement | null) => {
        checkbox?.classList.remove("e-checkbox-disabled");
        checkbox?.removeAttribute("disabled");
      };

      switch (value) {
        case 'Single':
          disableCheckbox(simpleMultiRowCheckbox, simpleMultiRowInput);
          enableCheckbox(checkboxOnlyCheckbox);
          if (!isNullOrUndefined(simpleMultiRowInput.ej2_instances)) {
            simpleMultiRowInput.ej2_instances[0].checked = false;
            gridInstance.selectionSettings.enableSimpleMultiRowSelection = false;
          }
          setCheckboxValues((prev) => {
            prev.simplemultirow = false;
            Object.keys(checkboxValues).forEach((prop) => {
              checkboxValues[prop] = prev[prop];
            });
            return prev;
          });
          break;

        case 'Multiple':
          enableCheckbox(simpleMultiRowCheckbox);
          if (dropRef['checkboxmodedefault'].value !== 'ResetOnRowClick') {
            enableCheckbox(checkboxOnlyCheckbox);
          }
          break;

        case 'Default':
          enableCheckbox(checkboxOnlyCheckbox);
          if (dropRef['selectiontype'].value === 'Single') {
            disableCheckbox(simpleMultiRowCheckbox, simpleMultiRowInput);
          } else {
            enableCheckbox(simpleMultiRowCheckbox);
          }
          break;

        case 'ResetOnRowClick':
          disableCheckbox(simpleMultiRowCheckbox, simpleMultiRowInput);
          disableCheckbox(checkboxOnlyCheckbox, checkboxOnlyInput);
          gridInstance.selectionSettings.enableSimpleMultiRowSelection = false;
          break;

        default:
          break;
      }
    },

    handlePagingChange: (value: any, id: string, checkRef: any, eventName: string) => {
      const setState = (keys: string[], prop: keyof HTMLInputElement, val: boolean) => {
        keys.forEach(k => checkRef[k][prop] = val);
      };

      const disableAllEnableVirtual = () => {
        setState(['autofill', 'paging', 'infinitescroll'], 'disabled', true);
        checkRef['virtualization'].disabled = false;
        checkRef['virtualization'].checked = true;
      };

      const enableAllAndCheckPaging = () => {
        setState(['infinitescroll', 'paging', 'autofill'], 'disabled', false);
        checkRef['paging'].checked = true;
      };

      if (eventName === 'Created') {
        if (checkRef['paging'].checked) {
          setState(['infinitescroll', 'virtualization'], 'disabled', true);
        } else if (checkRef['virtualization'].checked) {
          setState(['infinitescroll', 'autofill', 'paging'], 'disabled', true);
          checkRef['paging'].checked = false;
        } else if (checkRef['infinitescroll'].checked) {
          setState(['virtualization', 'autofill', 'paging'], 'disabled', true);
          checkRef['paging'].checked = false;
        } else {
          enableAllAndCheckPaging();
        }
      } else {
        if (id === 'paging') {
          if (!checkRef['paging'].checked) {
            disableAllEnableVirtual();
          } else {
            setState(['infinitescroll', 'virtualization'], 'disabled', true);
          }
        }

        if (id === 'virtualization') {
          if (value) {
            setState(['infinitescroll', 'autofill', 'paging'], 'disabled', true);
            checkRef['paging'].checked = false;
          } else {
            enableAllAndCheckPaging();
          }
        }

        if (id === 'infinitescroll') {
          if (value) {
            setState(['virtualization', 'autofill', 'paging'], 'disabled', true);
            checkRef['paging'].checked = false;
          } else {
            enableAllAndCheckPaging();
          }
        }
      }

      setCheckboxValues((prev) => {
        prev.paging = checkRef['paging'].checked;
        prev.enableinfinitescrolling = checkRef['infinitescroll'].checked;
        prev.virtualization = checkRef['virtualization'].checked;
        Object.keys(checkboxValues).forEach((prop) => {
          checkboxValues[prop] = prev[prop];
        });
        return prev;
      });
    }
  };

  const menuItemProperties = {
    gridLineProperties: [
      {
        iconCss: 'e-icons e-border-all',
        items: [
          { text: 'Both', id: 'GridLine Both', method: menuItemMethods.gridLineValueChange, checkbox: true },
          { text: 'Default', id: 'GridLine Default', method: menuItemMethods.gridLineValueChange, checkbox: false },
          { text: 'Horizontal', id: 'GridLine Horizontal', method: menuItemMethods.gridLineValueChange, checkbox: false },
          { text: 'Vertical', id: 'GridLine Vertical', method: menuItemMethods.gridLineValueChange, checkbox: false },
          { text: 'None', id: 'GridLine None', method: menuItemMethods.gridLineValueChange, checkbox: false }
        ],
      },
    ],
    aggregateValues: [
      {
        text: 'Sum',
        items: [
          { text: 'Sum', id: 'Aggregate Sum', checkbox: true, method: gridAggregateTemplates.SummaryCalculation },
          { text: 'Average', id: 'Aggregate Average', checkbox: false, method: gridAggregateTemplates.SummaryCalculation },
          { text: 'Min', id: 'Aggregate Min', checkbox: false, method: gridAggregateTemplates.SummaryCalculation },
          { text: 'Max', id: 'Aggregate Max', checkbox: false, method: gridAggregateTemplates.SummaryCalculation },
          { text: 'Count', id: 'Aggregate Count', checkbox: false, method: gridAggregateTemplates.SummaryCalculation }
        ],
      },
    ],
    aggregateGroupValues: [
      {
        text: 'Sum',
        items: [
          { text: 'Sum', id: 'Group Aggregate Sum', checkbox: true, method: gridAggregateTemplates.GroupSummaryCalculation },
          { text: 'Average', id: 'Group Aggregate Average', checkbox: false, method: gridAggregateTemplates.GroupSummaryCalculation },
          { text: 'Min', id: 'Group Aggregate Min', checkbox: false, method: gridAggregateTemplates.GroupSummaryCalculation },
          { text: 'Max', id: 'Group Aggregate Max', checkbox: false, method: gridAggregateTemplates.GroupSummaryCalculation },
          { text: 'Count', id: 'Group Aggregate Count', checkbox: false, method: gridAggregateTemplates.GroupSummaryCalculation }
        ],
      },
    ],
    columnMenuDateFormatProperties: [
      {
        text: 'Column Date',
        iconCss: 'e-icons e-settings icon',
        items: [
          { text: 'yMMM', id: 'Date Format yMMM', method: menuItemMethods.singleColumnSettingsDateFormat, checkbox: false },
          { text: 'dd/MM/yyyy', id: 'Date Format dd/MM/yyyy', method: menuItemMethods.singleColumnSettingsDateFormat, checkbox: true },
          { text: 'dd.MM.yyyy', id: 'Date Format dd.MM.yyyy', method: menuItemMethods.singleColumnSettingsDateFormat, checkbox: false },
          { text: 'dd/MM/yyyy hh:mm a', id: 'Date Format dd/MM/yyyy hh:mm a', method: menuItemMethods.singleColumnSettingsDateFormat, checkbox: false },
          { text: 'MM/dd/yyyy hh:mm:ss a', id: 'Date Format MM/dd/yyyy hh:mm:ss a', method: menuItemMethods.singleColumnSettingsDateFormat, checkbox: false }
        ],
      },
    ],
    columnMenuFormatProperties: [
      {
        text: 'Column Number',
        iconCss: 'e-icons e-settings icon',
        items: [
          {
            text: 'Header Text Alignment',
            items: [
              { text: 'Left', id: 'Header Left', method: menuItemMethods.singleColumnSettingsHeaderTextAlign, checkbox: false },
              { text: 'Right', id: 'Header Right', method: menuItemMethods.singleColumnSettingsHeaderTextAlign, checkbox: true },
              { text: 'Center', id: 'Header Center', method: menuItemMethods.singleColumnSettingsHeaderTextAlign, checkbox: false },
              { text: 'Justify', id: 'Header Justify', method: menuItemMethods.singleColumnSettingsHeaderTextAlign, checkbox: false },
            ]
          },
          {
            text: 'Cell Text Alignment',
            items: [
              { text: 'Left', id: 'Cell Left', method: menuItemMethods.singleColumnSettingsCellTextAlign, checkbox: false },
              { text: 'Right', id: 'Cell Right', method: menuItemMethods.singleColumnSettingsCellTextAlign, checkbox: true },
              { text: 'Center', id: 'Cell Center', method: menuItemMethods.singleColumnSettingsCellTextAlign, checkbox: false },
              { text: 'Justify', id: 'Cell Justify', method: menuItemMethods.singleColumnSettingsCellTextAlign, checkbox: false },
            ]
          },
          {
            text: 'Data Operations',
            items: [
              { text: 'Enable Editing', method: menuItemMethods.enableColumnEditing, singlecheckbox: true },
              { text: 'Enable Filtering', method: menuItemMethods.enableColumnFiltering, singlecheckbox: true },
              { text: 'Enable Grouping', method: menuItemMethods.enableColumnGrouping, singlecheckbox: true },
              { text: 'Enable Reordering', method: menuItemMethods.enableColumnReordering, singlecheckbox: true },
              { text: 'Enable Resizing', method: menuItemMethods.enableColumnResize, singlecheckbox: true },
              { text: 'Enable Searching', method: menuItemMethods.enableColumnSearching, singlecheckbox: true },
              { text: 'Enable Sorting', method: menuItemMethods.enableColumnSorting, singlecheckbox: false }
            ]
          },
          {
            text: 'Format',
            items: [
              { text: 'p0', id: 'Number Format p0', method: menuItemMethods.singleColumnSettingsFormat, checkbox: false },
              { text: 'p1', id: 'Number Format p1', method: menuItemMethods.singleColumnSettingsFormat, checkbox: false },
              { text: 'n0', id: 'Number Format n0', method: menuItemMethods.singleColumnSettingsFormat, checkbox: false },
              { text: 'n1', id: 'Number Format n1', method: menuItemMethods.singleColumnSettingsFormat, checkbox: false },
              { text: 'n2', id: 'Number Format n2', method: menuItemMethods.singleColumnSettingsFormat, checkbox: false },
              { text: 'C2', id: 'Number Format C2', method: menuItemMethods.singleColumnSettingsFormat, checkbox: true }
            ]
          }
        ],
      },
    ],
    columnMenuCheckboxProperties: [
      {
        text: 'Column Verified',
        iconCss: 'e-icons e-settings icon',
        items: [
          { text: 'Display as checkbox', method: menuItemMethods.enableCheckBoxChange, singlecheckbox: true },
          { text: 'Visible', method: menuItemMethods.hideSpecifiedColumn, singlecheckbox: true }
        ],
      },
    ],
    columnMenuProperties: [
      {
        text: 'Column Name',
        iconCss: 'e-icons e-settings icon',
        items: [
          {
            text: 'Clip Mode',
            items: [
              { text: 'Clip', id: 'ClipMode_Clip', method: menuItemMethods.singleColumnSettingsClipMode, checkbox: false },
              { text: 'Ellipsis', id: 'ClipMode_Ellipsis', method: menuItemMethods.singleColumnSettingsClipMode, checkbox: false },
              { text: 'EllipsisWithTooltip', id: 'ClipMode_EllipsisWithTooltip', method: menuItemMethods.singleColumnSettingsClipMode, checkbox: true },
            ]
          },
          { text: 'Enable Resizing', method: menuItemMethods.enableColumnResize, singlecheckbox: true },
          { text: 'Enable Grouping', method: menuItemMethods.enableColumnGrouping, singlecheckbox: true },
          { text: 'Enable Text Wrap', method: menuItemMethods.singleColumnSettingsTextWrap, singlecheckbox: false },
          { text: 'Enable Sorting', method: menuItemMethods.enableColumnSorting, singlecheckbox: false }
        ],
      },
    ],

    columnMenuFreezeProperties: [
      {
        text: 'Column Name',
        iconCss: 'e-icons e-settings icon',
        items: [
          { text: 'Display as HTML encode', method: menuItemMethods.htmlEncodeChange, singlecheckbox: true },
          { text: 'Enable Frozen', method: menuItemMethods.frozenChange, singlecheckbox: true },
          { separator: true },
          {
            text: 'Freeze',
            items: [
              { text: 'Left', id: 'Freeze Left', method: menuItemMethods.singleColumnSettingsFreeze, checkbox: true },
              { text: 'Right', id: 'Freeze Right', method: menuItemMethods.singleColumnSettingsFreeze, checkbox: false },
              { text: 'Fixed', id: 'Freeze Fixed', method: menuItemMethods.singleColumnSettingsFreeze, checkbox: false },
              { text: 'None', id: 'Freeze None', method: menuItemMethods.singleColumnSettingsFreeze, checkbox: false },
            ]
          }
        ],
      },
    ],

  };

  const propertyDescription: { [key: string]: string } = {
    "Enable Editing": "Allows editing the cell content in this specific column. If true, the user can modify the cell value in-place.",
    "Enable Reordering": "Allows the user to drag and reorder this column among others in the grid.",
    "Enable Searching": "If enabled, this column's values will be included in global search operations (like search textbox above the grid).",
    "Enable Resizing": "Enables users to adjust the width of the column by dragging its header edge.",
    "Enable Sorting": "The allowSorting property enables the sorting of grid records when clicking on the column header.",
    "Enable Multi-Column Sorting": "The allowMultiSorting property enables the user to sort multiple column in the grid.",
    "Enable Filtering": "The allowFiltering property enables the filter bar to be displayed.",
    "Enable Grouping": "The allowGrouping property allows dynamically grouping or ungrouping columns. Grouping can be done by dragging and dropping columns from the column header to the group drop area",
    "Enable Column Reordering": "The allowReordering property enables the reordering of grid columns by dragging and dropping columns from one index to another",
    "Enable Column Resizing": "The allowResizing property enables the resizing of grid columns.",
    "Enable Paging": "The allowPaging property enables a pager control to be rendered at the bottom of the grid, allowing you to navigate through different pages of data.",
    "Enable Immutable Mode": "The enableImmutableMode property is set to true, the grid will reuse old rows if it exists in the new result instead of full refresh while performing the grid actions.",
    "Allow Selection": "Various features enable selection processing in the Grid, including drag, hover, and focus interactions.",
    "Enable Row Drag and Drop": "The allowRowDragAndDrop property is set to true, you can drag and drop grid rows at another grid",
    "Enable Autofill": "When the enableAutoFill property is enabled, an auto-fill icon will be displayed when cells are selected for copying.",
    "Show Column Menu": "The showColumnMenu property is set to true, it will enable the column menu options in each columns.",
    "Allow Text Wrap": "The allowTextWrap property is set to true, then text content will wrap to the next line when its text content exceeds the width of the Column Cells.",
    "Auto-Fit Column Content": "The autoFit property, when enabled, automatically adjusts the width of columns based on the given width.",
    "Enable Alternate Row Styling": "The enableAltRow property is set to true, the grid will render with e-altrow CSS class to the alternative tr elements.",
    "Enable Row Hover Effect": "The enableHover property is set to true, the row hover is enabled in the Grid.",
    "Enable Header Focus": "The enableHeaderFocus is set to true, then header element will be focused when focus moves to grid.",
    "Enable Excel Export": "Export the Grid to Excel.",
    "Enable PDF Export": "Export the Grid to PDF",
    "Enable Virtual Scrolling": "The enableVirtualization property allows the Grid to render only the rows visible within the viewport and load subsequent rows on vertical scrolling. This helps in efficiently handling large datasets in the Grid.",
    "Enable Infinite Scrolling": "The enableInfiniteScrolling property is set to true, then the data will be loaded in Checkbox filter Popup content, when the scrollbar reaches the end. This helps to load large dataset in Checkbox filter Popup content.",
    "Show Group Drop Area": "The showDropArea property makes the group drop area element visible at the top of the Grid.",
    "Show Grouped Columns": "The showGroupedColumn property is set to false, it hides the grouped column after grouping.",
    "Show Toggle Button": "The showToggleButton property is set to true, then the toggle button will be showed in the column headers which can be used to group or ungroup columns by clicking them.",
    "Show Ungroup Icon in Header": "The showUngroupButton property is set to false, then ungroup button is hidden in dropped element. It can be used to ungroup the grouped column when click on ungroup button.",
    "Enable Case Sensitivity": "The enableCaseSensitivity property is set to true then searches grid records with exact match based on the filter operator. It will have no effect on number, boolean and Date fields.",
    "Ignore accent": "The ignoreAccent property is set to true, then filter ignores the diacritic characters or accents while filtering or searching.",
    "Filter Type": "It provides various filter options such as menu, Excel-like filtering, filter bar, and checkboxes to refine and search data efficiently.",
    "Show Filter Bar Operator": "The showFilterBarOperator property is set to true, then it renders the dropdownlist component to select the operator in filterbar input.",
    "Show Filter Bar Status": "The filterBarStatus propperty is set to true, shows or hides the filtered status message on the pager.",
    "Filter Bar Mode": "Filter bar modes define how filtering is triggered in the grid, either manually on Enter key press (OnEnter) or automatically after a delay (Immediate).",
    "Loading Indicator Type": "Display a loading indicator while the data is being loaded.",
    "Enable Toggle Selection": "The enableToggle property is set to true, then the user can able to perform toggle for the selected row.",
    "Enable Column Selection": "The allowColumnSelection is set to true, then the user can able to select the columns.",
    "Selection Type": "Specifies the selection types: Single (selects one row or cell) and Multiple (selects multiple rows or cells).",
    "Enable Simple Multi Row Selection": "The enableSimpleMultiRowSelection property is set to true, then the user can able to perform multiple row selection with single clicks.",
    "Allow Checkbox Selection Only": "The checkboxOnly property is set to true, then the Grid selection is allowed only through checkbox.",
    "Checkbox Selection Mode": "The Checkbox selection mode controls how rows are selected: 'Default' allows selecting multiple rows one by one, while 'ResetOnRowClick' clears previous selections and selects only the current row.",
    "Edit Mode": "Specifies the editing mode for the grid.",
    "Allow Adding Row": "The allowAdding property is set to true, new records can be added to the Grid.",
    "Allow Next Row Edit": "The allowNextRowEdit is set to true, editing is done to next row. By default allowNextRowEdit is set to false.",
    "New Row Position": "Specifies where a new row is added in the grid.",
    "Allow Editing Row": "The allowEditing is set to true, values can be updated in the existing record.",
    "Edit on Double Click": "The allowEditOnDblClick is set to false, Grid will not allow editing of a record on double click.",
    "Allow Delete Row": "The allowDeleting property is set to true, existing record can be deleted from the Grid.",
    "Show Confirmation Dialog": "The showConfirmDialog is set to false, confirm dialog does not show when batch changes are saved or discarded.",
    "Show Delete Confirmation Dialog": "The showDeleteConfirmDialog is set to true, confirm dialog will show delete action. You can also cancel delete command.",
    "Localization": "Localization is the process of adapting software, content, or applications to a specific region, language, or culture by translating text, formatting data, and modifying UI elements to align with local preferences.",
    "Theme": "A theme is a predefined set of visual styles, including colors, fonts, and layout, that determines the look and feel of an application or website. It helps create a consistent design across the entire interface.",
    "Interaction Type": "Interaction types are the various ways users engage with a system, such as clicking, typing, or touching.",
    "Enable RTL": "RTL (Right-to-Left) refers to the text direction used in languages like Arabic and Hebrew, where text is read and written starting from the right side of the page.",
    "Aggregate_Sum": "Calculates the total of all values in the column.",
    "Export": "Export the data as a PDF or Excel file using the available export properties",
    "Scrolling": "To enhance data loading and navigation in the Grid.",
    "Alignment": "Alignment of the columns header and cell contents.",
    "Data Operations": "Data operations in the Grid help manage and organize data through sorting, filtering, grouping, and paging.",
    "Aggregate_Average": "Computes the mean of all numeric values in the column.",
    "Aggregate_Min": "Displays the smallest value in the column.",
    "Aggregate_Max": "Displays the largest value in the column.",
    "Aggregate_Count": "Shows the number of records in the column.",
    "Group_Aggregate_Sum": "Calculates the total of all values in the column.",
    "Group_Aggregate_Average": "Computes the mean of all numeric values in the column.",
    "Group_Aggregate_Min": "Displays the smallest value in the column.",
    "Group_Aggregate_Max": "Displays the largest value in the column.",
    "Group_Aggregate_Count": "Shows the number of records in the column.",
    "Allow selection": "The allowSelection property is set to true, it allows selection of (highlight row) Grid records by clicking it",
    "Type": "Specifies the available filtering types, determining how data is filtered in the grid.",
    "Clip Mode": "Specifies how overflowed cell content is displayed in the grid.",
    "Freeze": "Specifies the column freeze direction in the grid.",
    "Header text alignment": "Define the alignment of column header which is used to align the text of column header.",
    "Cell text alignment": "Defines the alignment of the column in both header and content cells.",
    "Searching": "The allowSearching property is set to false, then it disables Searching of a particular column. By default all columns allow Searching.",
    "Display as HTML encode": "The disableHtmlEncode property is set to true, it encodes the HTML of the header and content cells.",
    "Format": "Formats the displayed value without altering the original data. Supports standard and custom number or date formats.",
    "Group by format": "The enableGroupByFormat property is set to true, then it groups the particular column by formatted values. By default no columns are group by format.",
    "Display as checkbox": "The displayAsCheckBox property is set to true, it displays the column value as a check box instead of Boolean value.",
    "Visible": "Controls column visibility in the grid. When visible is set to false, the column is hidden. By default, all columns are shown.",
    "Operator": "Defines the search operator for Column Chooser.",
    "Default": "This is the default checkboxMode, allowing users to select multiple rows by clicking them individually.",
    "ResetOnRowClick": "In ResetOnRowClick mode, clicking a row resets the previously selected row. Multiple rows can be selected using the CTRL or SHIFT key.",
    "Single": "Allows selection of only a row or a cell.",
    "Multiple": "Allows selection of multiple rows or cells.",
    "Normal": "Normal mode allows inline editing of a single row at a time.",
    "Dialog": "Dialog opens a pop-up dialog for editing the selected row",
    "Batch": "Batch enables multiple row edits before saving changes in bulk.",
    "Top": "Inserts the new row at the beginning of the grid.",
    "Bottom": "Adds the new row at the end of the grid.",
    "ClipMode_Clip": "Truncates the cell content when it overflows its area.",
    "ClipMode_Ellipsis": "Displays ellipsis when the cell content overflows its area.",
    "ClipMode_EllipsisWithTooltip": "Displays ellipsis when the cell content overflows its area also it will display tooltip while hover on ellipsis applied cell.",
    "ClipMode": "Defines the cell content’s overflow mode",
    "Enable Frozen": "To freeze a specific column in the Grid, set the isFrozen property of that column to true.",
    "Freeze_Left": "Freeze the column at left side.",
    "Freeze_Right": "Freeze the column at right side.",
    "Freeze_Fixed": "Freeze the column at center.",
    "Freeze_None": "Does not freeze the column.",
    "Header_Center": "Defines center alignment of the header text within the column.",
    "Header_Left": "Defines justify alignment of the header text within the column.",
    "Header_Right": "Defines center alignment of the header text within the column.",
    "Header_Justify": "Defines justify alignment of the header text within the column.",
    "Cell_Center": "Defines center alignment of the content text within the cell.",
    "Cell_Justify": "Defines justify alignment of the content text within the cell.",
    "Cell_Left": "Defines left alignment of the content text within the cell.",
    "Cell_Right": "Defines right alignment of the content text within the cell.",
    "Number_Format_p0": "The number is converted to percentage with 0 decimal place",
    "Number_Format_p1": "The number is converted to percentage with 1 decimal place",
    "Number_Format_n0": "The number is rounded to 0 decimal place",
    "Number_Format_n1": "The number is rounded to 1 decimal place",
    "Number_Format_n2": "The number is rounded to 2 decimal place",
    "Number_Format_C2": "The currency symbol is appended to number and number is rounded to 2 decimal place",
    "Date_Format_yMMM": "Displays year and abbreviated month name",
    "Date_Format_dd/MM/yyyy": "Common date format (day-first) used in the UK, India, etc.",
    "Date_Format_dd.MM.yyyy": "European format using dots as separators",
    "Date_Format_dd/MM/yyyy_hh:mm_a": "Displays date with time in 12-hour format",
    "Date_Format_MM/dd/yyyy_hh:mm:ss_a": "US format with full timestamp and AM/PM",
    "Spinner": "Shows a rotating loader to indicate processing",
    "Shimmer": "Displays a shimmering effect as a placeholder until data loads.",
    "OnEnter": "Initiates filter operation after Enter key is pressed.",
    "Immediate": "Initiates filter operation after a certain time interval. By default, time interval is 1500 ms.",
    "Menu": "Specifies the filter type as menu.",
    "Checkbox": "Specifies the filter type as checkbox.",
    "FilterBar": "Specifies the filter type as filterbar.",
    "Excel": "Specifies the filter type as checkbox.",
    "Selection type": "Selection types include Single (selects one row or cell) and Multiple (selects multiple rows or cells).",
    "Small": " Compact rows with minimal spacing (25px) for a tighter layout.",
    "Medium": "Balanced spacing (36px) for better readability and a comfortable view.",
    "Large": "Wide spacing (60px) for a clear and spacious data display.",
    "GridLine_Default": "Displays grid lines based on the theme.",
    "GridLine_Both": "Displays both the horizontal and vertical grid lines.",
    "GridLine_Vertical": "Displays the vertical grid lines only.",
    "GridLine_Horizontal": "Displays the horizontal grid lines only.",
    "GridLine_None": "No grid lines are displayed.",
    "Persist Selection": "The persistSelection is set to true, the Grid selection is maintained across all operations, and at least one column must be enabled as the primary key to persist the selection.",
    "Enable Text Wrap": "When the cell/header content exceeds the column width, it wraps onto multiple lines to ensure the entire text is visible."
  };

  const menuItemTemplates = {

    gridLineCustomization: () => {
      return (
        <div style={{ marginTop: '3px' }}>
          <MenuComponent
            items={menuItemProperties.gridLineProperties}
            fields={menuFields}
            enableRtl={enableRtlListView}
            template={menuItemTemplates.menuSwitchTemplate}
            showItemOnClick={true}
            cssClass='grid-line'
          />
        </div>
      )
    },

    buttonClick: (args: any) => {
      document.getElementById('dialogbox')!.style.left = `${args.clientX}px`;
      let topPosition = document.getElementById('search_box')!.getBoundingClientRect().height + args.clientY - 10;
      document.getElementById('dialogbox')!.style.top = `${topPosition}px`;
      const dialog = document.getElementById('dialogbox');
      const gridContainer = document.getElementById('overviewgrid');
      const viewportWidth = window.innerWidth;
      if (!dialog) return;
      const dialogWidth = dialog.offsetWidth;
      const containerRect = gridContainer?.getBoundingClientRect();
      const maxLeft = Math.min(viewportWidth, containerRect?.right || viewportWidth) - dialogWidth;
      let left = args.clientX;
      if (left > maxLeft) {
        left = maxLeft - 10;
      }
      dialog.style.left = `${left}px`;
      setStatus(true);
      dialogInstance?.show();
    },

    textValue: (args: ChangedEventArgs) => {
      setSearchText(() => {
        searchText = args.value ?? '';
        return searchText;
      });
    },

    dialogCreated: () => {
      dialogInstance?.hide();
    },

    dialogClose: () => {
      setStatus(false);
    },

    dialogOpen: () => {
      setStatus(true);
    },

    columnFieldsChange: (args: any) => {
      setSelectedField(() => {
        selectedField = args.value;
        return selectedField;
      });
    },

    operatorValueChange: (args: any) => {
      setSelectedOperator(() => {
        selectedOperator = args.value;
        return selectedOperator;
      });
    },

    caseSensitiveChange: (args: any) => {
      setCaseSensitiveChecked(() => {
        caseSensitiveChecked = args.checked;
        return caseSensitiveChecked;
      });
    },

    ignoreAccentChange: (args: any) => {
      setIgnoreAccentChecked(() => {
        ignoreAccentChecked = args.checked;
        return ignoreAccentChecked;
      });
    },

    createListBox: () => {
      return (
        <div className="filter-container">
          <div className="filter-row">
            <div className="search-column-group">
              <label>Search by</label>
              <DropDownListComponent
                id="search_by" key={selectedField || "ShipCountry"}
                dataSource={dropdownDataSource.columnFields}
                onChange={menuItemTemplates.columnFieldsChange}
                placeholder="ShipCountry"
                popupHeight="220px"
              />
            </div>

            <div className="search-operator-group">
              <label>Operator</label>
              <DropDownListComponent
                id="search_by" key={selectedOperator}
                onChange={menuItemTemplates.operatorValueChange}
                dataSource={[
                  { text: 'equal', value: 'equal' },
                  { text: 'startswith', value: 'startswith' },
                  { text: 'endswith', value: 'endswith' },
                  { text: 'wildcard', value: 'wildcard' },
                  { text: 'like', value: 'like' },
                  { text: 'notequal', value: 'notequal' },
                ]}
                fields={{ text: 'text', value: 'value' }}
                placeholder="equal"
                popupHeight="220px"
              />
            </div>
          </div>
          <div className="check-text">
            <label>Text Preferences</label>
            <div className="checkbox-group">
              <CheckBoxComponent id="case-sensitive"
                change={menuItemTemplates.caseSensitiveChange} checked={caseSensitiveChecked} /> &nbsp;&nbsp;
              <label>Case sensitive</label> &nbsp; | &nbsp; &nbsp;
              <CheckBoxComponent
                change={menuItemTemplates.ignoreAccentChange} id="ignore-accent" checked={ignoreAccentChecked} /> &nbsp; &nbsp;
              <label>Ignore accent</label>
            </div>
          </div>
        </div>
      )
    },

    chipClick: (args: any) => {
      if (!gridInstance) return;
      if (args.target.textContent === "Clear filter") {
        gridInstance.clearFiltering();
        gridInstance.search("");
        textboxInstance.value = "";
        dialogInstance!.hide();
      } else if (args.target.textContent === "Search") {
        if (selectedField && selectedOperator) {
          gridInstance.searchSettings = {
            fields: [selectedField],
            operator: selectedOperator,
            ignoreCase: caseSensitiveChecked,
            ignoreAccent: ignoreAccentChecked,
            key: searchText,
          };
          if (!caseSensitiveChecked) {
            gridCommonTemplates.emptyMessageTemplate();
          }
        } else {
          console.warn("Search field and operator are required.");
        }
      }
    },


    createDialogFooter: () => {
      return (
        <div >
          <ChipListComponent id="chip-choice" selection="Single" enableRtl={enableRtlListView} selectedChips={[1]} onClick={menuItemTemplates.chipClick}>
            <ChipsDirective>
              <ChipDirective text="Clear filter" cssClass="selectchip"></ChipDirective>
              <ChipDirective text="Search" cssClass="selectchip"></ChipDirective>
            </ChipsDirective>
          </ChipListComponent>
        </div>

      )
    },

    menuTextboxSearch: () => {
      return (
        <div className="search-container">
          <TextBoxComponent
            id="search_box"
            placeholder="Search..."
            onClick={menuItemTemplates.buttonClick}
            change={menuItemTemplates.textValue}
            cssClass="search-input"
            ref={(text: TextBoxComponent | null) => {
              if (text) {
                textboxInstance = text;
              }
            }}
          ></TextBoxComponent>
          <DialogComponent
            ref={(dialog: any) => dialogInstance = dialog}
            id="dialogbox"
            enableRtl={enableRtlListView}
            created={menuItemTemplates.dialogCreated}
            footerTemplate={menuItemTemplates.createDialogFooter}
            content={menuItemTemplates.createListBox}
            showCloseIcon={false}
            visible={status}
            width={'300px'}
            open={menuItemTemplates.dialogOpen}
            close={menuItemTemplates.dialogClose}
            height={'228px'}
          >
          </DialogComponent>
        </div>
      )
    },

    getLabelElement: (switchId: string | GridPropertiesGroup, treeViewElement: Element | null): HTMLElement | null => {
      let labelElement: HTMLElement | null = null;
      if (typeof switchId === "object" && !isNullOrUndefined(switchId) && Array.isArray(switchId["items"])) {
        switchId["items"].some((item: any) => {
          const labelClass = item.label?.replace(/\s+/g, "") + "-custom-label";
          labelElement = treeViewElement!.querySelector('label') as HTMLElement;
          return !!labelElement;
        });
      }
      return labelElement;
    },


    beforeOpen: ((args: BeforeOpenEventArgs, switchId: string | any): void => {
      const targetElement = args.target as HTMLElement;
      const treeViewElement = targetElement.closest('.treeviewdiv');
      let labelElement: HTMLElement | null;
      let description: string;
      let labelText: string;

      if (treeViewElement) {
        if (switchId && Array.isArray(switchId["items"])) {
          labelElement = menuItemTemplates.getLabelElement(switchId, targetElement.parentElement);
          labelText = labelElement!.innerText;
          description = labelElement ? propertyDescription[labelText] : '';
        } else if (switchId.includes('switch')) {
          labelElement = targetElement.parentElement!.querySelector('label') as HTMLElement;
          labelText = labelElement!.innerText;
          description = labelElement ? propertyDescription[labelText] : '';
        } else if (switchId.includes('check')) {
          labelElement = targetElement.parentElement!.querySelector('label') as HTMLElement;
          labelText = switchId.split('_check')[0];
          description = labelElement ? propertyDescription[labelText] : '';
        }
        else {
          labelElement = treeViewElement.querySelector(`.${switchId?.replace(/\s+/g, "")}-custom-label`)?.querySelector('label') as HTMLElement;
          labelText = switchId;
          description = labelElement ? propertyDescription[labelText] : '';
        }
        if (labelElement === null) {
          labelElement = treeViewElement.querySelector('.e-checkbox-wrapper label .e-label') as HTMLElement;
          description = labelElement ? propertyDescription[labelElement.innerText.trim()] : '';
        }
        if (description && tooltipRefs.current[labelText]) {
          tooltipRefs.current[labelText]!.content = description;
        }
      }
    }),

    changeCheckBox: (args: ChangeEventArgs, checkId: string, checkRefs: any) => {
      setCheckedStates((prevState) => {
        const newState = {
          ...prevState,
          [checkId]: args.checked,
        };
        checkedStates = newState;

        // Common function to update group checkboxes by prefix
        const updateGroupCheckboxes = (prefix: string) => {
          if (checkId.includes(prefix)) {
            const checkInstance = Object.fromEntries(
              Object.entries(checkRefs.current).filter(([key, _]) =>
                key.startsWith(prefix)
              )
            );

            Object.entries(checkInstance).forEach(([id, ref]: [string, any]) => {
              const isChecked = id === checkId ? args.checked : false;
              if (ref && typeof ref.checked !== "undefined") {
                ref.checked = isChecked;
              }
              newState[id] = isChecked;
            });
          }
        };

        // Update based on different groups single check box selection
        ['Header', 'Cell', 'GridLine', 'Number_Format', 'Date_Format', 'Aggregate', 'ClipMode', 'Group_Aggregate'].forEach(prefix => {
          if (checkId.includes(prefix)) {
            updateGroupCheckboxes(prefix);
          }
        });

        return newState;
      });
    },

    changeSwitch: (args: ChangeEventArgs, switchId: string, data: any) => {
      setSwitchStates((prevState) => {
        const newState = {
          ...prevState,
          [switchId]: args.checked,
        };
        switchStates = newState;
        return newState;
      });
    },

    menuSwitchTemplate: (data: any) => {
      if (!isNullOrUndefined(data.properties.iconCss)) {
        return (<div className={data.properties.iconCss === "e-icons e-settings icon" ? "iconviewdiv" : "treeviewdiv"}>
          <label>
            <span className={data.properties.iconCss}></span>
            &nbsp; {data.properties.text !== "Column Name" &&
              data.properties.text !== "Column Date" && data.properties.text !== "Column Number"
              && data.properties.text !== "Column Verified" ? data.properties.text : ""}
          </label>
        </div>);
      }
      else if (!isNullOrUndefined(data.singlecheckbox)) {
        let switchId = data.properties.text.replace(/\s/g, "_") + "_switch";
        return (
          <div className="treeviewdiv">
            <TooltipComponent ref={(t: any) => {
              if (t) tooltipRefs.current[data.properties.text] = t;
            }} windowCollision={true} mouseTrail={true}
              target='.single-column-exclamation-container' enableRtl={enableRtlListView} position="RightCenter" beforeOpen={(args) => menuItemTemplates.beforeOpen(args, switchId)} >
              <div>
                <CheckBoxComponent
                  id={switchId}
                  label={data.properties.text}
                  cssClass="custom-checkbox"
                  enableRtl={enableRtlListView}
                  disabled={data.disable}
                  change={(args) => {
                    if (args.event.target.innerText !== 'Visible') {
                      menuItemTemplates.changeSwitch(args, switchId, data);
                    }
                    data.method(args);
                  }}
                  checked={switchStates[switchId] ?? data.singlecheckbox}
                />
                <div className='single-column-exclamation-container' style={{ ...(enableRtlListView && { marginRight: '10px' }) }}>
                  <span className="e-icons e-circle-info icon" ></span>
                </div>
              </div>
            </TooltipComponent>
          </div>
        );
      }
      else if (!isNullOrUndefined(data.checkbox)) {
        let checkId = data.properties.id.replace(/\s/g, "_") + "_check";
        return (
          <div className="treeviewdiv">
            <TooltipComponent ref={(t: any) => {
              if (t) tooltipRefs.current[data.properties.id.replace(/\s/g, "_")] = t;
            }} windowCollision={true} mouseTrail={true}
              target='.single-column-exclamation-container' enableRtl={enableRtlListView} position="RightCenter" beforeOpen={(args) => menuItemTemplates.beforeOpen(args, checkId)} >
              <div><CheckBoxComponent id={checkId} enableRtl={enableRtlListView}
                ref={(instance: any) => {
                  if (instance) {
                    checkRefs.current[checkId] = instance;
                  }
                }}
                label={data.properties.text} cssClass='custom-checkbox'
                disabled={data.disable}
                change={(args) => {
                  menuItemTemplates.changeCheckBox(args, checkId, checkRefs);
                  data.method(args, data);
                }} checked={checkedStates[checkId] ?? data.checkbox} />
                <div className="single-column-exclamation-container" style={{ ...(enableRtlListView && { marginRight: '10px' }) }}>
                  <span className="e-icons e-circle-info icon" ></span>
                </div>
              </div>
            </TooltipComponent>
          </div>
        );
      }
      else {
        let textId = data.properties.text.replace(/\s/g, "_") + "_text";
        return (<div className="treeviewdiv">
          <div className="treeName">
            <div className="setting-row"><label style={{
              color: data.disable ? "gray" : "black",
              pointerEvents: data.disable ? "none" : "auto",
              userSelect: data.disable ? "none" : "auto",
              opacity: data.disable ? 0.5 : 1
            }}>{data.properties.text}</label>
            </div>
          </div>
        </div>);
      }
    },
  }

  const gridFilterTemplates = {
    filterTemplate: () => {
      return (
        <span></span>
      )
    },

    templateOptionsNumericTextBox: {
      create: () => {
        numericElement = document.createElement('input');
        return numericElement;
      },
      write: (args: any) => {
        const uniqueFreightValues = Array.from(new Set((employeeDetails as { Freight: number }[]).map(emp => emp.Freight))).map(freight => ({ Freight: freight }));
        const freightNumbers = uniqueFreightValues.map(obj => obj.Freight);
        const minFreight = Math.floor(Math.min(...freightNumbers));
        const maxFreight = Math.floor(Math.max(...freightNumbers));
        const datePickerObj = new NumericTextBox({
          cssClass: 'e-fltrtemp-focus',
          min: minFreight,
          max: maxFreight,
          format:'n0',
          enableRtl: enableRtlListView,
          change: gridFilterTemplates.handleFilterChange,
        });
        datePickerObj.appendTo(numericElement);
      },
    },

    templateOptionsDatePicker: {
      create: () => {
        dateElement = document.createElement('input');
        return dateElement;
      },
      write: (args: any) => {
        const datePickerObj = new DatePicker({
          value: new Date(args.column.field),
          placeholder: 'Select the Order Date',
          enableRtl: enableRtlListView,
          change: gridFilterTemplates.handleFilterChange,
        });
        datePickerObj.appendTo(dateElement);
      },
    },

    createInputElement: () => createElement('input'),

    getUniqueFieldValues: (data: any[], field: string): any[] => {
      const uniqueSet = new Set(data.map(item => item[field]));
      return Array.from(uniqueSet).map(value => ({ [field]: value }));
    },

    createAutoCompleteFilter: (placeholder: string, dataSource: any[], appendElement: HTMLElement, options?: Partial<AutoComplete>) => {
      const autoComplete = new AutoComplete({
        dataSource,
        placeholder,
        change: gridFilterTemplates.handleFilterChange,
        ...(options || {})
      });
      autoComplete.appendTo(appendElement);
    },

    productIDFilter: {
      create: () => productIDInput = gridFilterTemplates.createInputElement(),
      write: () => gridFilterTemplates.createAutoCompleteFilter('Product ID', employeeDetails, productIDInput)
    },

    productNameFilter: {
      create: () => productNameInput = gridFilterTemplates.createInputElement(),
      write: () => {
        const data = gridFilterTemplates.getUniqueFieldValues(employeeDetails, 'ProductID');
        gridFilterTemplates.createAutoCompleteFilter('Product Name', data, productNameInput);
      }
    },

    customerNameFilter: {
      create: () => customerNameInput = gridFilterTemplates.createInputElement(),
      write: () => {
        const data = gridFilterTemplates.getUniqueFieldValues(employeeDetails, 'CustomerName');
        gridFilterTemplates.createAutoCompleteFilter('Customer Name', data, customerNameInput);
      }
    },

    customerMailIDFilter: {
      create: () => customerMailIDInput = gridFilterTemplates.createInputElement(),
      write: () => {
        const data = gridFilterTemplates.getUniqueFieldValues(employeeDetails, 'EmailID');
        gridFilterTemplates.createAutoCompleteFilter('Email ID', data, customerMailIDInput);
      }
    },

    shipCountryFilter: {
      create: () => shipCountryInput = gridFilterTemplates.createInputElement(),
      write: () => {
        const data = gridFilterTemplates.getUniqueFieldValues(employeeDetails, 'ShipCountry');
        gridFilterTemplates.createAutoCompleteFilter('Select the Ship Country', data, shipCountryInput, {
          showPopupButton: true,
          fields: { value: 'ShipCountry' }
        });
      }
    },

    orderIDFilter: {
      create: () => orderIDInput = gridFilterTemplates.createInputElement(),
      write: () => {
        const data = gridFilterTemplates.getUniqueFieldValues(employeeDetails, 'OrderID');
        gridFilterTemplates.createAutoCompleteFilter('Order ID', data, orderIDInput);
      }
    },

    handleFilterChange: (args: any) => {
      if (!isNullOrUndefined(args.element) || (!isNullOrUndefined(args.event) && !isNullOrUndefined(args.event.currentTarget))) {
        let targetElement = parentsUntil(args.element || args.event.currentTarget, 'e-filtertext');
        let columnName = targetElement.id.replace('_filterBarcell', '');
        if (args.value) {
          gridInstance.filterByColumn(columnName, 'equal', args.value);
        } else {
          gridInstance.removeFilteredColsByField(columnName);
        }
      }
    },

    templateCheckBox: {
      create: () => {
        checkboxElement = document.createElement('input');
        checkboxElement.setAttribute('type', "checkbox");
        checkboxElement.id = 'Verified';
        return checkboxElement;
      },
      write: (args: any) => {
        const checkbox = new CheckBox({
          checked: args.value,
          indeterminate: true,
          enableRtl: enableRtlListView,
          change: function (args) {
            var predicate = new Predicate('Verified', 'equal', args.checked);
            var filteredData = new DataManager(employeeDetails).executeLocal(new Query().where(predicate));
            gridInstance.dataSource = filteredData;
          }
        });
        checkbox.appendTo(checkboxElement);
      },
    },

    handlestatusFilterChange: (args: DdtSelectEventArgs) => {
      let columnName = "TrackingStatus";
      if (gridInstance) {
        if (args.action === "select") {
          if (!selectedValues.includes(args.itemData.text as string)) {
            selectedValues.push(args.itemData.text as string);
          }
        } else if (args.action === "un-select") {
          selectedValues = selectedValues.filter(value => value !== args.itemData.text);
        }
        let filterValues = selectedValues.map(value => (value === "Paid" ? true : false));
        if (selectedValues.length === 0 || filterValues.length > 1) {
          gridInstance.removeFilteredColsByField(columnName);
        } else {
          gridInstance.filterByColumn(columnName, 'equal', filterValues.length === 1 ? filterValues[0] : filterValues);
        }
      }
    },

    statusFilter: {
      create: (args: any) => {
        dropdownTreeElement = createElement('input');
        return dropdownTreeElement;
      },
      write: (args: any) => {
        let statusData = [{ status: 'Paid' }, { status: 'Not Paid' }];
        const dropInstance = new DropDownTree({
          fields: { dataSource: statusData, text: 'status', value: 'status' },
          showCheckBox: true,
          showSelectAll: true,
          enableRtl: enableRtlListView,
          value: statusData.map(item => item.status),
          placeholder: 'Select the Status',
          select: gridFilterTemplates.handlestatusFilterChange
        });
        dropInstance.appendTo(dropdownTreeElement);
      }
    }
  };

  const gridProperties = {
    filterOptions: { showFilterBarOperator: true, showFilterBarStatus: false } as FilterSettingsModel,
    toolbarOptions: [
      { text: '', prefixIcon: 'e-add', id: 'add_icon', tooltipText: 'Add Records' },
      { type: 'Separator' },
      { text: '', prefixIcon: 'sf-icon-expand-collapse', id: 'expand_icon', tooltipText: 'Expand/Collapse' },
      { text: '', prefixIcon: 'sf-icon-clear-sorting', id: 'clearsorting_icon', tooltipText: 'Clear Sorting' },
      { text: '', prefixIcon: 'e-filter-clear icon', id: 'clearfilter_icon', tooltipText: 'Clear Filtering' },
      { type: 'Separator' },
      { text: '', prefixIcon: 'sf-icon-clear-selection', id: 'clear_selection', tooltipText: 'Clear Selection' },
      { text: '', prefixIcon: 'sf-icon-row-clear', id: 'clear_row_selection', tooltipText: 'Clear Row Selection' },
      { text: '', prefixIcon: 'sf-icon-column-clear', id: 'clear_column_selection', tooltipText: 'Clear Column Selection' },
      { text: '', prefixIcon: 'sf-icon-clear-cell', id: 'clear_cell_selection', tooltipText: 'Clear Cell Selection' },
      { type: 'Separator' },
      { text: '', template: menuItemTemplates.gridLineCustomization },
      { type: 'Separator' },
      { text: '', prefixIcon: 'e-csvexport', id: 'export_csv', tooltipText: 'Export CSV' },
      { text: '', prefixIcon: 'e-excelexport', id: 'export_excel', tooltipText: 'Export Excel' },
      { text: '', prefixIcon: 'e-pdfexport', id: 'export_pdf', tooltipText: 'Export PDF' },
      { text: '', template: menuItemTemplates.menuTextboxSearch, align: 'Right' },
      'ColumnChooser',
      { text: '', align: 'Right', id: 'grid_properties', template: gridCommonTemplates.HeaderTemplate }
    ] as (ToolbarItems | Object)[],
    pageOptions: { pageCount: 5, pageSizes: [5, 10, 12, 20, 30], pageSize: 30 },
    editOptions: { allowEditing: true, allowAdding: true, allowDeleting: true, showDeleteConfirmDialog: true, showConfirmDialog: true, mode: 'Normal' as EditMode },
    contextMenuOptions: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending', 'Group', 'Ungroup', 'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage',
      'LastPage', 'NextPage'] as ContextMenuItem[] | ContextMenuItemModel[],
    sortingOptions: {
      columns: [{ field: 'OrderID', direction: 'Ascending' }, { field: 'Quantity', direction: 'Descending' }]
    } as SortSettingsModel,
    columnSelection: {
      allowColumnSelection: true, type: 'Multiple', mode: 'Row', persistSelection: true
    } as SelectionSettingsModel,
    commands: [
      { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
      { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
      { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
      { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
    ] as CommandModel[],
    aggregatetype: ['Min', 'Max'] as AggregateType | AggregateType[] | string,
    customerColumns: [
      {
        field: 'EmployeeImage',
        headerText: 'Image',
        visible: false,
        allowGrouping: false,
        textAlign: 'Center',
        minWidth: 55,
        maxWidth: 150,
        width: 127,
        filterTemplate: gridFilterTemplates.filterTemplate,
        allowFiltering: false,
        disableHtmlEncode: false,
        template: gridCommonTemplates.imageTemplate,
        editTemplate: gridCommonTemplates.uploaderEditTemplate
      },
      {
        field: 'CustomerName',
        editType: 'stringedit',
        headerText: 'Customer Name',
        minWidth: 73,
        maxWidth: 200,
        validationRules: customerIDRules,
        disableHtmlEncode: false,
        filterBarTemplate: gridFilterTemplates.customerNameFilter
      },
      {
        headerText: 'Email ID',
        field: 'EmailID',
        editType: 'stringedit',
        minWidth: 62,
        maxWidth: 270,
        width: 230,
        validationRules: emailIDRules,
        filterBarTemplate: gridFilterTemplates.customerMailIDFilter
      }
    ] as ColumnModel[],
    productColumns: [
      {
        field: 'ProductID',
        headerText: 'Product ID',
        textAlign: 'Right',
        minWidth: 160,
        maxWidth: 200,
        width: 170,
        validationRules: productIDRules,
        editType: 'stringedit',
        filterTemplate: gridFilterTemplates.filterTemplate,
        template: gridCommonTemplates.productTemplate,
        allowFiltering: false,
      },
      {
        field: 'ProductName',
        headerText: 'Product Name',
        clipMode: 'EllipsisWithTooltip',
        minWidth: 100,
        maxWidth: 250,
        width: 210,
        validationRules: customerIDRules,
        filterBarTemplate: gridFilterTemplates.productNameFilter
      }
    ] as ColumnModel[],
    orderColumns: [
      {
        field: 'OrderDate',
        headerText: 'Order Date',
        headerTemplate: gridCommonTemplates.columnMenuDateFormatSettings,
        format: 'yMd',
        type: 'date',
        minWidth: 105,
        maxWidth: 220,
        width: 180,
        allowSorting: false,
        showColumnMenu: false,
        textAlign: 'Right',
        headerTextAlign: 'Right',
        validationRules: orderDateRules,
        editType: "datepickeredit",
        filterBarTemplate: gridFilterTemplates.templateOptionsDatePicker,
      },
      {
        field: 'Quantity',
        minWidth: 65,
        maxWidth: 200,
        width: 130,
        textAlign: 'Right',
        validationRules: freightIDRules,
        filterBarTemplate: gridFilterTemplates.templateOptionsNumericTextBox,
        editType: "numericedit",
      },
      {
        field: 'Freight',
        allowSorting: false,
        showColumnMenu: false,
        headerTemplate: gridCommonTemplates.columnMenuFormatSettings,
        headerText: 'Freight ($)',
        width: 248,
        minWidth: 195,
        maxWidth: 280,
        format: 'C2',
        textAlign: 'Right',
        headerTextAlign: 'Right',
        validationRules: freightIDRules,
        filterBarTemplate: gridFilterTemplates.templateOptionsNumericTextBox,
        editType: "numericedit",
      }
    ] as ColumnModel[],

    shippingColumns: [
      {
        field: 'ShipCountry',
        headerText: 'Ship Country',
        headerTemplate: gridCommonTemplates.shipCountryTemplate,
        width: 140,
        minWidth: 115,
        maxWidth: 200,
        template: gridCommonTemplates.countryTemplate,
        editType: 'dropdownedit',
        allowSorting: false,
        validationRules: shipCountryRules,
        dataSource: dropdownDataSource.shipCountryData,
        filterBarTemplate: gridFilterTemplates.shipCountryFilter,
      },
      {
        field: 'ShipAddress',
        headerText: 'Ship Address',
        width: 135,
        minWidth: 100,
        maxWidth: 250,
        allowSorting: false,
        showColumnMenu: false,
        clipMode: 'EllipsisWithTooltip',
        headerTemplate: gridCommonTemplates.columnClipModeSettings,
      },
      {
        field: 'ShipName',
        headerText: 'Ship Name',
        minWidth: 80,
        maxWidth: 200,
        width: 130,
        clipMode: 'EllipsisWithTooltip'
      }
    ] as ColumnModel[]

  };

  const gridPropertiesConfigurations: GridPropertiesConfigurations = {
    'Group Settings': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'reordering', label: 'Enable Column Reordering', defaultChecked: true },
          { id: 'showdroparea', label: 'Show Group Drop Area', defaultChecked: true },
          { id: 'showgroupedcolumn', label: 'Show Grouped Columns', defaultChecked: false },
          { id: 'showtogglebutton', label: 'Show Toggle Button', defaultChecked: false },
          { id: 'showungroupbutton', label: 'Show Ungroup Icon in Header', defaultChecked: false },
        ]
      }
    ],
    'Header Settings': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'sorting', label: 'Enable Sorting', defaultChecked: true },
          { id: 'multisorting', label: 'Enable Multi-Column Sorting', defaultChecked: true },
          { id: 'filtering', label: 'Enable Filtering', defaultChecked: true },
          { id: 'grouping', label: 'Enable Grouping', defaultChecked: true },
          { id: 'reordering', label: 'Enable Column Reordering', defaultChecked: true },
          { id: 'resizing', label: 'Enable Column Resizing', defaultChecked: true }
        ]
      }
    ],
    'Grid Settings': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'selection', label: 'Allow Selection', defaultChecked: true },
          { id: 'textwrap', label: 'Allow Text Wrap', defaultChecked: false },
          { id: 'paging', label: 'Enable Paging', defaultChecked: true, method: menuItemMethods.handlePagingChange },
          { id: 'draganddrop', label: 'Enable Row Drag and Drop', defaultChecked: false },
          { id: 'autofill', label: 'Enable Autofill', defaultChecked: false },
          { id: 'autofit', label: 'Auto-Fit Column Content', defaultChecked: true },
          { id: 'column_menu', label: 'Show Column Menu', defaultChecked: false },
          { id: 'general_grid', type: 'Separator' }
        ]
      },
      {
        groupField: 'Appearance & Interaction',
        items: [
          { id: 'altrow', label: 'Enable Alternate Row Styling', defaultChecked: false },
          { id: 'hover', label: 'Enable Row Hover Effect', defaultChecked: true },
          { id: 'grid_appearance', type: 'Separator' }
        ]
      },
      {
        groupField: 'Data Export',
        items: [
          { id: 'excelexport', label: 'Enable Excel Export', defaultChecked: true },
          { id: 'pdfexport', label: 'Enable PDF Export', defaultChecked: true }
        ]
      },
      {
        groupField: 'Scrolling Options',
        items: [
          { id: 'virtualization', label: 'Enable Virtual Scrolling', defaultChecked: false, method: menuItemMethods.handlePagingChange },
          { id: 'infinitescroll', label: 'Enable Infinite Scrolling', defaultChecked: false, method: menuItemMethods.handlePagingChange }
        ]
      }
    ],


    'Filter Settings': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'enablecasesensitivity', label: 'Enable Case Sensitivity', defaultChecked: false },
          { id: 'ignoreaccent', label: 'Ignore Accent', defaultChecked: false },
          { id: 'filtertype', label: 'Filter Type', marginLeft: '49%', marginRTL: '44%', type: 'dropdown', dataSource: dropdownDataSource.filterBarTypeOptions, placeholder: selectedFilterType, method: menuItemMethods.handleFilterTypeChange, value: selectedFilterType },
          { id: 'grid_filter', type: 'Separator' }
        ]
      },
      {
        groupField: 'Filter Bar Settings',
        items: [
          { id: 'filterbar', label: 'Show Filter Bar Operator', defaultChecked: true },
          { id: 'barstatus', label: 'Show Filter Bar Status', defaultChecked: false },
          { id: 'filterbarmode', label: 'Filter Bar Mode', marginLeft: '42%', marginRTL: '37%', type: 'dropdown', dataSource: dropdownDataSource.filterBarModeOptions, placeholder: selectedFilterBarMode, value: selectedFilterBarMode },
          { id: 'grid_filter_bar', type: 'Separator' }
        ]
      },
      {
        groupField: 'Excel / Checkbox Filter Settings',
        items: [
          { id: 'enableinfinitescrolling', label: 'Enable Infinite Scrolling', defaultChecked: false },
          { id: 'loadingindicator', label: 'Loading Indicator Type', marginLeft: '34%', marginRTL: '25%', type: 'dropdown', dataSource: dropdownDataSource.indicators, placeholder: selectedIndicator, value: selectedIndicator }
        ]
      },
    ],
    'Edit Settings': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'editmode', label: 'Edit Mode', type: 'dropdown', dataSource: dropdownDataSource.editMode, dataFields: { text: 'text', value: 'value', disabled: 'isDisabled' }, method: menuItemMethods.disableDropdownItem, marginLeft: '48%', marginRTL: '44%', placeholder: selectEditMode, value: selectEditMode },
          { id: 'nextrowedit', label: 'Allow Next Row Edit', defaultChecked: true },
          { id: 'grid_edit', type: 'Separator' }
        ]
      },
      {
        groupField: 'Add Action Settings',
        items: [
          { id: 'adding', label: 'Allow Adding Row', defaultChecked: true },
          { id: 'newrowposition', label: 'New Row Position', type: 'dropdown', marginLeft: '39%', marginRTL: '33%', dataSource: dropdownDataSource.newRowPosition, placeholder: selectNewRowPosition, value: selectNewRowPosition },
          { id: 'grid_add', type: 'Separator' }
        ]
      },
      {
        groupField: 'Edit Action Settings',
        items: [
          { id: 'editing', label: 'Allow Editing Row', defaultChecked: true },
          { id: 'editondoubleclick', label: 'Edit on Double Click', defaultChecked: true },
          { id: 'confirmdialog', label: 'Show Confirmation Dialog', defaultChecked: true },
          { id: 'grid_edit', type: 'Separator' }
        ]
      },
      {
        groupField: 'Delete Action Settings',
        items: [
          { id: 'deleting', label: 'Allow Delete Row', defaultChecked: true },
          { id: 'deletedialog', label: 'Show Delete Confirmation Dialog', defaultChecked: true }
        ]
      }
    ],
    'Selection Settings': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'selectiontype', label: 'Selection Type', type: 'dropdown', marginLeft: '43%', marginRTL: '39%', method: menuItemMethods.selectionTypeChange, dataSource: dropdownDataSource.selectiontype, placeholder: selectionType, value: selectionType },
          { id: 'toggle', label: 'Enable Toggle Selection', defaultChecked: true },
          { id: 'columnselection', label: 'Enable Column Selection', defaultChecked: true },
          { id: 'simplemultirow', label: 'Enable Simple Multi Row Selection', defaultChecked: true, disabled: false },
          { id: 'grid_selection', type: 'Separator' }
        ]
      },
      {
        groupField: 'Checkbox Selection Settings',
        items: [
          { id: 'persistselection', label: 'Persist Selection', defaultChecked: true },
          { id: 'checkboxonly', label: 'Allow Checkbox Selection Only', defaultChecked: false },
          { id: 'checkboxmodedefault', label: 'Checkbox Selection Mode', type: 'dropdown', marginLeft: '29%', marginRTL: '26%', method: menuItemMethods.selectionTypeChange, dataSource: dropdownDataSource.checkboxmode, placeholder: selectedCheckMode, value: selectedCheckMode },

        ]
      }
    ],
    'Web Standards': [
      {
        groupField: 'General Settings',
        items: [
          { id: 'rtl', label: 'Enable RTL', defaultChecked: false },
          { id: 'localization', label: 'Localization', type: 'dropdown', marginLeft: '45%', marginRTL: '40%', valueTemplate: gridCommonTemplates.localeValueTemplate, itemTemplate: gridCommonTemplates.localizationFlagTemplate, dataSource: dropdownDataSource.localizationData, placeholder: localization.current, value: localization.current },
          { id: 'theme', label: 'Theme', type: 'dropdown', marginLeft: '51%', marginRTL: '47%', dataSource: dropdownDataSource.themeData, placeholder: theme.current, value: theme.current },
          { id: 'interactiontype', label: 'Interaction Type', type: 'dropdown', marginLeft: '40%', marginRTL: '35%', dataSource: dropdownDataSource.modeData, placeholder: displayMode.current, value: displayMode.current }
        ]
      }
    ],
  };

  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};

    Object.keys(gridPropertiesConfigurations).forEach((category) => {
      gridPropertiesConfigurations[category as keyof GridPropertiesConfigurations].forEach((item) => {
        if ('groupField' in item) {
          // Item is a CheckboxGroup
          const groupItems = (item as GridPropertiesGroup).items;

          // Ensure groupItems is an array before iterating
          if (Array.isArray(groupItems)) {
            groupItems.forEach((checkbox) => {
              initialState[checkbox.id] = checkbox.defaultChecked ?? false;
            });
          }
        } else {
          // Item is a CheckboxConfig
          const checkbox = item as GridPropertiesConfig;
          initialState[checkbox.id] = checkbox.defaultChecked ?? false;
        }
      });
    });
    return initialState;
  });

  const customComponentTemplates = {

    toolbarDialog: (selectedText: any) => {
      setIsDialog(true);
      dialogObj?.show();
      let result = dropdownDataSource.listViewData.find((item) => item.text.includes(selectedText));
      if (result && listObj) {
        selectedItemRef.current = result;
        const listContent = document.getElementById("listContent");
        const newContent = customComponentTemplates.addPropertiesInsideDialogbox(result.text);
        if (listContent !== null && newContent !== null) {
          root = createRoot(listContent);
          root.render(newContent);
        }
      }
    },

    addPropertiesInsideDialogbox: (selectedListItem: string) => {
      if (!(selectedListItem in gridPropertiesConfigurations)) return null;
      const gridProperties = gridPropertiesConfigurations[selectedListItem as keyof GridPropertiesConfigurations];
      if (!gridProperties) return null;
      return (
        <div className="checkbox-group">
          {gridProperties.map((propertyFields: any) => (
            <div className="treeviewdiv">
              <TooltipComponent ref={(t: any) => {
                if (propertyFields && Array.isArray(propertyFields["items"])) {
                  propertyFields["items"].some((item: any) => {
                    if (t) tooltipRefs.current[item.label] = t;
                  });
                } else {
                  if (t) tooltipRefs.current[propertyFields.label] = t;
                }
              }} windowCollision={true} mouseTrail={true}
                target='.exclamation-container' enableRtl={enableRtlListView} position="RightCenter" beforeOpen={(args) => menuItemTemplates.beforeOpen(args, propertyFields.label || propertyFields)}>
                {(() => {
                  return (
                    <div key={propertyFields.id || propertyFields.groupField}>
                      <div>
                        {/* Group Header */}
                        <div style={{ fontWeight: "500", fontSize: "15px" }}>{propertyFields.groupField}</div>
                        <br />
                        {/* Render Checkboxes or Dropdown for Group */}
                        {propertyFields.items.map((item: any) => (
                          <div key={item.id} id={item.id} className={`${item.label?.replace(/\s+/g, "")}-custom-label`}>
                            {item.type === "dropdown" ? (
                              // created div element for the dropdown list element
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  width: '100%'
                                }}
                              >
                                {/* created div element for the dropdown label element */}
                                <div
                                  style={{
                                    alignItems: 'center',
                                    gap: '10px',
                                    ...(enableRtlListView && { marginLeft: '10px' })
                                  }}
                                >
                                  {/* created dropdown label value */}
                                  <label
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "400",
                                      whiteSpace: 'nowrap',
                                    }}
                                    className={`${item.label.replace(/\s+/g, "")}-custom-label`}
                                  >
                                    {item.label}
                                  </label>
                                </div>
                                {/* created div element for the icon symbol */}
                                <div className="exclamation-container" style={{ marginLeft: '10px' }} >
                                  <span className="e-icons e-circle-info icon"></span>
                                </div>
                                {/* created dropdown component */}
                                <div style={{ [enableRtlListView ? 'marginRight' : 'marginLeft']: enableRtlListView ? item.marginRTL : item.marginLeft }}>
                                  <DropDownListComponent
                                    id={item.id}
                                    ref={(instance: any) => {
                                      if (instance) {
                                        dropdownRefs.current[item.id] = instance;
                                      }
                                    }}
                                    itemTemplate={item.itemTemplate}
                                    valueTemplate={item.valueTemplate}
                                    dataSource={item.dataSource}
                                    fields={item.dataFields ? item.dataFields : { text: 'text', value: 'value' }}
                                    value={dropdownValues[item.id] || item.placeholder}
                                    enableRtl={enableRtlListView}
                                    width={166}
                                    created={(e) => {
                                      gridPrivateMethods.changeDropdownValue(item.id, dropdownValues[item.id] || item.placeholder);
                                      if (!isNullOrUndefined(item.dataFields)) {
                                        item.method(item.dataSource, dropdownRefs.current, item.id);
                                      } else if (!isNullOrUndefined(item.method)) {
                                        item.method(dropdownRefs.current[item.id].value, dropdownRefs.current);
                                      }
                                    }}
                                    change={(e) => {
                                      gridPrivateMethods.changeDropdownValue(item.id, e.value);
                                      if (!isNullOrUndefined(item.method)) {
                                        item.method(e.value, dropdownRefs.current);
                                      }
                                    }}
                                    placeholder={item.placeholder}
                                  /></div>
                              </div>
                            ) : item.type === "Separator" ? (
                              /* Separator Element */
                              <hr className="separator-line" />
                            ) : (
                              <div id={item.id} className={`${item.label?.replace(/\s+/g, "")}-custom-label`} style={{
                                display: "flex",
                                alignItems: "center"
                              }}>
                                {/* created checkbox component if the groupfield contains in the checkbox configurations */}
                                <CheckBoxComponent
                                  id={item.id}
                                  ref={(instance: any) => {
                                    if (instance) {
                                      checkboxRefs.current[item.id] = instance;
                                    }
                                  }}
                                  label={item.label}
                                  enableRtl={enableRtlListView}
                                  checked={checkboxValues[item.id]}
                                  created={(e) => {
                                    if (!isNullOrUndefined(item.method)) {
                                      item.method(checkboxValues[item.id], item.id, checkboxRefs.current, 'Created');
                                    }
                                  }}
                                  change={(e) => {
                                    gridPrivateMethods.handleCheckboxChange(item.id, e.checked);
                                    if (!isNullOrUndefined(item.method)) {
                                      item.method(e.checked, item.id, checkboxRefs.current, 'Change');
                                    }
                                  }}
                                />
                                &nbsp;&nbsp; &nbsp;
                                <div className="exclamation-container">
                                  <span className="e-icons e-circle-info icon"></span>
                                </div>
                              </div>
                            )}
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </TooltipComponent>
            </div>
          ))}
        </div>
      );
    },

    trackingChipTemplate: (props: Orders): JSX.Element => {
      return (
        <ChipListComponent ref={(chip: ChipListComponent | null) => {
          if (chip) {
            chipStatus = chip;
          }
        }}
          style={{ height: '25px', ...(enableRtlListView ? { gap: '5px' } : {}) }} enableRtl={enableRtlListView} text={props.TrackingStatus ? 'Paid' : 'Not Paid'} cssClass={props.TrackingStatus ? "chip-paid" : "chip-not-paid"}></ChipListComponent>
      );
    },

    ratingTemplate: (props: Orders): JSX.Element => {
      return (
        <div>
          <RatingComponent id={'ratingTempalte' + props.EmployeeID} enableRtl={enableRtlListView} showLabel={true} labelPosition='Left' precision='Half' labelTemplate="<span style='font-size:14px;'>${value}</span>" name={'Rating'} value={props.Rating} readOnly={true} cssClass='e-custom-rating'></RatingComponent>
        </div>
      );
    },

    ratingEditTemplate: (props: Orders): JSX.Element => {
      const isRTL = document.getElementById('overviewgrid')?.classList.contains('e-rtl');
      const ratingClass = isRTL ? 'e-custom-rating e-rtl' : 'e-custom-rating';
      return (
        <div>
          {showEditLabel && (
            <label style={{ color: '#9b9696', fontSize: '11px', top: '-9px', display: "flex", direction: isRTL ? 'rtl' : 'ltr' }}>Rating</label>
          )}
          <RatingComponent id={'ratingEdit' + props.EmployeeID} name={'Rating'} enableRtl={enableRtlListView} value={props.Rating} cssClass={ratingClass} ></RatingComponent>
        </div>
      );
    },

    progressTemplate: (props: Orders): JSX.Element => {
      let colorValue: string = props.OrderStatus === 'Delivered' ? "#205107" : props.OrderStatus === 'Cancelled' ? '#B3261E' : '#914C00';
      return (
        <div style={{ width: '200px', textAlign: 'right' }}>
          <ProgressBarComponent
            id={"progress_" + props.OrderID} style={{ marginTop: '-8px' }}
            type="Linear"
            value={(props.OrderStatus === 'Delivered' || props.OrderStatus === 'Cancelled') ? 100 : 80}
            trackThickness={4}
            progressThickness={4}
            enableRtl={enableRtlListView}
            animation={{ enable: false }}
            trackColor={props.OrderStatus === 'Delivered' ? "rgba(32, 81, 7, 0.2)"
              : props.OrderStatus === 'Cancelled' ? "rgba(179, 38, 30, 0.2)"
                : "rgba(145, 76, 0, 0.2)"}
            progressColor={colorValue}
          ></ProgressBarComponent>
          <div style={{ marginTop: '-15px', marginRight: '10px', fontSize: '11px', fontWeight: '500', color: colorValue }}>
            {props.OrderStatus}
          </div>
        </div>
      );
    }

  };

  const handleGridEvent = {
    onGridCreated: () => {
      startTime = new Date().getTime();
    },

    cellSelect: () => {
      const selectedCells = gridInstance.getSelectedRowCellIndexes();
      if (selectedCells.length > 0) {
        setRowIndexValue(`${selectedCells.map((cell) => cell.rowIndex).join(", ")}`);
        setCellIndexValue(`${selectedCells.map((cell) => cell.cellIndexes).join(", ")}`);
      }
    },

    onDataBound: () => {
      if (gridInstance) {
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime);
        setLoadingTime(Number(elapsedTime));
        let dataCount = 0;
        if (Array.isArray(gridInstance.dataSource)) {
          dataCount = gridInstance.dataSource.length;
        } else if (gridInstance.dataSource instanceof DataManager) {
          gridInstance.dataSource.executeQuery(new Query()).then((e: any) => {
            setTotalCount(e.result.length);
          });
        }
        setTotalCount(dataCount);
        gridInstance.scrollModule.refresh();
      }
    },

    selectedRow: () => {
      setSelectedCount(gridInstance.getSelectedRecords().length);
    },

    onActionComplete: (args: PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs | NotifyArgs | ReorderEventArgs) => {
      if (args.requestType === 'filtering') {
        filteredData = gridInstance.getFilteredRecords();
        if (Array.isArray(filteredData)) {
          setFilteredCount(filteredData.length);
        }
      } else if (args.requestType === "searching") {
        setSearchedCount(gridInstance.currentViewData.length);
      } else if (args.requestType === "save" && 'action' in args && args.action === "add") {
        setAddedCount((prevCount) => prevCount + 1);
      } else if (args.requestType === "delete") {
        setDeletedCount((prevCount) => prevCount + (args as any).data.length);
      } else if (args.requestType === "save") {
        setUpdatedCount((prevCount) => prevCount + 1);
      }
    },

    actionBegin: (args: PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs | NotifyArgs | ReorderEventArgs): void => {

      if ((isHeaderTemplate || ((args as any).target && (args as any).target.closest && (args as any).target.closest('.e-icons.e-settings.icon'))) && args.requestType === 'sorting') {
        isHeaderTemplate = false;
        args.cancel = true;
      }
      if (args.requestType === 'beginEdit' || args.requestType === 'add') {
        showEditLabel = gridInstance.editSettings.mode === 'Dialog' ? true : false;
      }
      if (args.requestType === 'save' && batchFlag && imageStream) {
        ((args as any).data as Orders).EmployeeImage = imageStream;
        imageStream = '';
      }

      if (args.requestType === "grouping") {
        setExpandCollapseValue("grouping");
      } if (args.requestType === "ungrouping") {
        setExpandCollapseValue("ungrouping");
      }
    },

    excelPdfQueryCellInfo: (args: ExcelQueryCellInfoEventArgs) => {
      (args.data as Orders).Verified = true
      if (args.column.headerText === "Customer Image") {
        args.image = {
          base64: (args.data as Orders).EmployeeImage,
          height: 70,
          width: 70,
        };
      }
    },

    toolbarClick: (args: ContextMenuClickEventArgs): void => {
      if (args.item.id === 'clearsorting_icon') {
        gridInstance.clearSorting();
      } else if (args.item.id === 'clear_row_selection') {
        gridInstance.clearRowSelection();
      }
      else if (args.item.id === 'clear_column_selection') {
        gridInstance.selectionModule.clearColumnSelection();
      }
      else if (args.item.id === 'clear_cell_selection') {
        gridInstance.clearCellSelection();
      }
      else if (args.item.id === 'clearfilter_icon') {
        gridInstance.clearFiltering();
      }
      else if (args.item.id === 'expand_icon') {
        if (expandCollapseValue === 'grouping' && isExpand) {
          isExpand = false;
          gridInstance.groupModule.collapseAll();
        } else {
          gridInstance.groupModule.expandAll();
          isExpand = true;
        }
      }
      else if (args.item.id === 'clear_selection') {
        gridInstance.clearSelection();
      } else if (args.item.id === 'export_pdf') {
        gridInstance?.pdfExport();
      } else if (args.item.id === 'export_excel') {
        gridInstance?.excelExport();
      } else if (args.item.id === 'add_icon') {
        gridInstance?.addRecord();
      } else if (args.item.id === 'export_csv') {
        gridInstance?.csvExport();
      } else if (args.item.id === "grid_properties") {
        customComponentTemplates.toolbarDialog("Header Settings");
      }
    },

    queryCellInfo: (args: QueryCellInfoEventArgs): void => {
      if ((args.column as ColumnModel).field === 'Freight' && args.data && (args.data as Orders).Freight !== undefined) {
        const FreightData = (args.data as Orders).Freight;
        (args.cell as HTMLElement).style.backgroundColor = FreightData < 50 ? '#F9DEDC' : FreightData > 50 && FreightData < 100 ? 'transparent' : '#F9DEDC';
        (args.cell as HTMLElement).style.color = FreightData < 50 ? '#B3261E'
          : FreightData > 50 && FreightData < 100 ? '#205107' : '#B3261E';
        (args.cell as HTMLElement).style.fontSize = '14px';
        (args.cell as HTMLElement).style.fontWeight = '700';
      }
    },

    beforePaste: (args: BeforePasteEventArgs): void => {
      if ((args.column as ColumnModel).field === 'Freight') {
        let numberParser = intl.getNumberParser({ format: 'c1' });
        (args as { value: number }).value = numberParser((args as { value: number }).value);
      }
    },

    cellSave: (args: CellSaveArgs): void => {
      if ((window.event?.target as HTMLElement).closest('.e-upload')) {
        args.cancel = true;
      }
      if (batchFlag && (args.column as ColumnModel).headerText === "Customer Image") {
        const existingIndex: number = batchEdit.findIndex((item) => item.orderID === (args.rowData as Orders).OrderID);
        if (existingIndex !== -1) {
          batchEdit[existingIndex].employeeImage = imageStream;
        } else {
          let newBatchEdit = {
            orderID: (args.rowData as Orders).OrderID,
            employeeImage: imageStream,
          };
          batchEdit.push(newBatchEdit);
        }
      }
    },

    cellSaved: (): void => {
      batchFlag = false;
    }
  };

  const initialGridRender: JSX.Element = useMemo(() => {
    return (
      <GridComponent ref={(grid: GridComponent | null) => {
        if (grid) {
          gridInstance = grid;
        }
      }} enableAltRow={false} dataSource={employeeDetails.slice(0, 10000)} id="overviewgrid"
        gridLines={'Both'}
        height={'100%'} width={"100%"}
        allowPaging={true}
        showColumnChooser={true}
        allowReordering={true}
        allowFiltering={true}
        allowPdfExport={true}
        enableRtl={false}
        allowExcelExport={true}
        allowRowDragAndDrop={false}
        allowTextWrap={false}
        allowSorting={true}
        allowSelection={true}
        allowGrouping={true}
        enableStickyHeader={false}
        allowResizing={true}
        filterSettings={gridProperties.filterOptions}
        toolbar={gridProperties.toolbarOptions}
        pageSettings={gridProperties.pageOptions}
        editSettings={gridProperties.editOptions}
        contextMenuItems={gridProperties.contextMenuOptions}
        sortSettings={gridProperties.sortingOptions}
        selectionSettings={gridProperties.columnSelection}
        actionBegin={handleGridEvent.actionBegin}
        excelQueryCellInfo={handleGridEvent.excelPdfQueryCellInfo}
        pdfQueryCellInfo={handleGridEvent.excelPdfQueryCellInfo}
        toolbarClick={handleGridEvent.toolbarClick}
        queryCellInfo={handleGridEvent.queryCellInfo}
        beforeAutoFill={handleGridEvent.beforePaste}
        cellSave={handleGridEvent.cellSave}
        cellSaved={handleGridEvent.cellSaved}
        created={handleGridEvent.onGridCreated}
        cellSelected={handleGridEvent.cellSelect}
        dataBound={handleGridEvent.onDataBound}
        rowSelected={handleGridEvent.selectedRow}
        actionComplete={handleGridEvent.onActionComplete}
        emptyRecordTemplate={gridCommonTemplates.emptyMessageTemplate}
      >
        <ColumnsDirective>
          <ColumnDirective type='checkbox' freeze="Left"
            width={40} minWidth={35} maxWidth={80} />
          <ColumnDirective field="OrderID" minWidth={60} maxWidth={100}
            disableHtmlEncode={false} headerText='Order ID' freeze="Left" 
            isPrimaryKey={true} textAlign={'Right'} width={115}
            validationRules={orderIDRules}
            filterBarTemplate={gridFilterTemplates.orderIDFilter}
          />
          <ColumnDirective headerTemplate={gridCommonTemplates.customerDetailsTemplate} textAlign={'Center'} columns={gridProperties.customerColumns} width='100' />
          <ColumnDirective headerTemplate={gridCommonTemplates.productDetailsTemplate} textAlign={'Center'} columns={gridProperties.productColumns} width='100' />
          <ColumnDirective headerTemplate={gridCommonTemplates.orderDetailsTemplate} textAlign={'Center'} columns={gridProperties.orderColumns} width='100' />
          <ColumnDirective headerTemplate={gridCommonTemplates.shippingDetailsTemplate} textAlign={'Center'} columns={gridProperties.shippingColumns} width='100' />
          <ColumnDirective field='OrderStatus' filterTemplate={gridFilterTemplates.filterTemplate} headerText='Order Status' headerTextAlign='Center' width={220} minWidth={210} maxWidth={250} template={customComponentTemplates.progressTemplate} visible={false} />
          <ColumnDirective field='Verified' editType='booleanedit' showColumnMenu={false} minWidth={90} maxWidth={200}
            headerTemplate={gridCommonTemplates.columnMenuCheckboxSettings} headerTextAlign={'Center'}
            headerText='Verified' allowSorting={false} filterBarTemplate={gridFilterTemplates.templateCheckBox} textAlign={'Center'} displayAsCheckBox={true} width={150} />
          <ColumnDirective field='TrackingStatus' headerText='Payment Status' visible={false}
            filterBarTemplate={gridFilterTemplates.statusFilter} minWidth={90} maxWidth={200}
            textAlign='Center' width={120} template={customComponentTemplates.trackingChipTemplate}
          />
          <ColumnDirective field='Rating' freeze="Right" minWidth={230} maxWidth={300}
            filterTemplate={gridFilterTemplates.filterTemplate} headerTextAlign='Center' width={250} template={customComponentTemplates.ratingTemplate} visible={false}
            editTemplate={customComponentTemplates.ratingEditTemplate} />
          <ColumnDirective headerText='Commands' filterTemplate={gridFilterTemplates.filterTemplate} 
           freeze="Right"
            textAlign={'Center'} width={120} minWidth={100} maxWidth={200} headerTextAlign={'Center'} commands={gridProperties.commands} />
        </ColumnsDirective>
        <AggregatesDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              <AggregateColumnDirective field='Freight' type='Sum' format='C2' footerTemplate={gridAggregateTemplates.aggregateCustomization('footer')}> </AggregateColumnDirective>
              <AggregateColumnDirective field='ProductID' type='Count' footerTemplate={gridAggregateTemplates.footerCountTemplate}> </AggregateColumnDirective>
              <AggregateColumnDirective field='Rating' type='Average' footerTemplate={gridAggregateTemplates.footerAvgTemplate}> </AggregateColumnDirective>
            </AggregateColumnsDirective>
          </AggregateDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              <AggregateColumnDirective field='Freight' type='Sum' format='C2' groupFooterTemplate={gridAggregateTemplates.aggregateCustomization('groupFooter')}> </AggregateColumnDirective>
              <AggregateColumnDirective field='ProductID' type='Count' groupFooterTemplate={gridAggregateTemplates.footerCountTemplate}> </AggregateColumnDirective>
              <AggregateColumnDirective field='Rating' type='Average' groupFooterTemplate={gridAggregateTemplates.footerAvgTemplate}> </AggregateColumnDirective>
            </AggregateColumnsDirective>
          </AggregateDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              <AggregateColumnDirective field='Freight' type={gridProperties.aggregatetype} groupCaptionTemplate={gridAggregateTemplates.groupCaptionMaxTemplate}> </AggregateColumnDirective>
            </AggregateColumnsDirective>
          </AggregateDirective>
        </AggregatesDirective>
        <Inject services={[Sort, CommandColumn, Aggregate, Edit, Group, RowDD, Freeze, VirtualScroll, ContextMenu, ColumnMenu, Filter, LazyLoadGroup, Page, PdfExport, InfiniteScroll, ExcelExport, Reorder, Resize, Toolbar, Search, ColumnChooser]} />
      </GridComponent>
    )
  }, []);

  return (
    <div id="overalContainer">
      <div id="gridDisplayDetails"
        style={{
          display: "flex"
        }}
      >
        {[
          { label: "Loading Time", value: loadingTime, color: "#6750A4" },
          { label: "Filtered", value: filteredCount, color: "#6750A4" },
          { label: "Searched", value: searchedCount, color: "#6750A4" },
          { label: "Selected", value: selectedCount, color: "#6750A4" },
          { label: "New", value: addedCount, color: "#6750A4" },
          { label: "Updated", value: updatedCount, color: "#6750A4" },
          { label: "Deleted", value: deletedCount, color: "#B3261E" },
          { label: "Row Index", value: rowIndexValue, color: "#6750A4" },
          { label: "Cell Index", value: cellIndexValue, color: "#6750A4" },
        ].map((item, index) => (
          <div id="individualElementDetails"
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px"
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'Roboto',
                fontWeight: '400',
                color: '#49454E',
              }}
            >
              {item.label}  {"-"}
            </span>
            <span
              style={{
                color: item.color,
                fontFamily: 'Roboto',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {/* {item.value} */}
              {item.label === 'Loading Time' ? (
                <>
                  <span style={{ fontWeight: 600, color: '#3F51B5' }}>{item.value}</span>
                  <span style={{ color: '#5C6BC0' }}> ms</span>
                </>
              ) : (
                item.value
              )
              }
            </span>
          </div>
        ))}
      </div>
      <div className='parent-Grid-Container'>
        {initialGridRender}
      </div>
    </div>
  );
}

export default App;

function loadLocalization() {
  const localization = [arLocalization, deLocalization, frLocalization, zhLocalization];
  for (let i = 0; i < localization.length; i++) {
    L10n.load(localization[i]);
  }
};

interface BatchOrders {
  orderID: number;
  employeeImage: string
}

export interface Orders {
  OrderID: number;
  CustomerName: string;
  ShipCountry: string;
  EmployeeID: number;
  EmployeeImage: string;
  Quantity: number;
  Rating: number;
  Freight: number;
  Verified: boolean;
  TrackingStatus: boolean;
  OrderStatus: string;
}

export interface KeyDataType { [key: string]: Object; }

interface GridPropertiesConfig {
  id: string;
  label?: string;
  defaultChecked?: boolean;
  type?: string;
  dataSource?: object;
  placeholder?: string;
  method?: Function;
  value?: string;
  marginLeft?: string;
  marginRTL?: string;
  valueTemplate?: Function;
  itemTemplate?: Function;
  disabled?: boolean;
  dataFields?: FieldSettingsModel
}

interface GridPropertiesConfigurations {
  'Header Settings': GridPropertiesGroup[];
  'Grid Settings': GridPropertiesGroup[];
  'Group Settings': GridPropertiesGroup[];
  'Filter Settings': GridPropertiesGroup[];
  'Edit Settings': GridPropertiesGroup[];
  'Selection Settings': GridPropertiesGroup[];
  'Web Standards': GridPropertiesGroup[];
}

interface GridPropertiesGroup {
  groupField: string;
  items: GridPropertiesConfig[];
}

interface ExtendedMenuItemModel extends MenuItemModel {
  template?: any;
}

interface ChangeEventArgs {
  checked: boolean;
}