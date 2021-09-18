import { Button, Col, Input, Row, Tag } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import EntityScanViewTable from '../EntityScanViewTable';
import IconUtils from '../../../api/utils/IconUtils';
import EventUtils from '../../../api/utils/EventUtils';
import MessageUtils from '../../../api/utils/MessageUtils';
import WaferUnpackMLotRequest from '../../../api/gc/wafer-unpack/WaferUnpackMLotRequest';
import { Notification } from '../../notice/Notice';

export default class GCCobRetestLabelAndMakeUpTable extends EntityScanViewTable {

    static displayName = 'GCCobRetestLabelAndMakeUpTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createLotPrintButton());
        buttons.push(this.createCstPrintButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createPrintCountInput());
        tags.push(this.createBoxQty());
        tags.push(this.createPieceQty());
        tags.push(this.createTotalNumber());
        return tags;
    }

    createTotalNumber = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if (data.currentQty != undefined) {
                    count = count + data.currentQty;
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalQty)}：{count}</Tag>
    }

    createBoxQty = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PackageQty)}：{this.state.data.length}</Tag>
    }

    createPieceQty = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if (data.currentSubQty != undefined) {
                    count = count + data.currentSubQty;
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PieceQty)}：{count}</Tag>
    }

    createPrintCountInput = () => {
        return  <Row gutter={6}>
            <Col span={3} >
                <span style={{marginLeft:"10px", fontSize:"19px"}}>
                    {I18NUtils.getClientMessage(i18NCode.PrintCount)}:
                </span>
            </Col>
            <Col span={3}>
                <Input ref={(printCount) => { this.printCount = printCount }} defaultValue={1} key="printCount" placeholder="打印份数"/>
            </Col>
        </Row>
    }

    handleLotPrint = () => {
        const {data} = this.state;
        let self = this;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        let printCount = this.printCount.state.value;

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
        
        if (data && data.length > 0) {
            let requestObject = {
                materialLot : data[0],
                printCount: printCount,
                printType: "",
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            WaferUnpackMLotRequest.sendCobRetestLabelAndMakeUpRequest(requestObject);
        }
    }

    handleCstPrint = () => {
        const {data} = this.state;
        let self = this;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        let printCount = this.printCount.state.value;

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
        
        if (data && data.length > 0) {
            let requestObject = {
                materialLot : data[0],
                printCount: printCount,
                printType: "PRINT_LOT",
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            WaferUnpackMLotRequest.sendCobRetestLabelAndMakeUpRequest(requestObject);
        }
    }

    createLotPrintButton = () => {
        return <Button key="print" type="primary" loading={this.state.loading} style={styles.tableButton}  onClick={() => this.handleLotPrint()}>
             {IconUtils.buildIcon("icon-barcode")}{I18NUtils.getClientMessage(i18NCode.BtnLotPrint)}</Button>;
    }

    createCstPrintButton = () => {
        return <Button key="print" type="primary" loading={this.state.loading} style={styles.tableButton} onClick={() => this.handleCstPrint()}>
             {IconUtils.buildIcon("icon-barcode")}{I18NUtils.getClientMessage(i18NCode.BtnCstPrint)}</Button>;
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
