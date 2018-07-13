import {expect} from "chai";
import "mocha";
import {SLTApiCall} from "../src/api/call/SLTApiCall";
import {SLTAppDataApiCall} from "../src/api/call/SLTAppDataApiCall";
import {SLTAppData} from "../src/SLTAppData";
import {SLTAddPropertiesApiCall} from "../src/api/call/SLTAddPropertiesApiCall";
import {SLTHeartbeatApiCall} from "../src/api/call/SLTHeartbeatApiCall";
import {SLTLevelContentApiCall} from "../src/api/call/SLTLevelContentApiCall";
import {SLTStatus} from "../src/status/SLTStatus";
import {SLTSaltr} from "../src/SLTSaltr";

const clientKey: string = "815230";
const socialId: string = "100000024783448";
const sltSaltr: SLTSaltr = new SLTSaltr(clientKey, socialId);

describe("Test Saltr SDK", () => {

    it('getAppData', () => {
        const appData: SLTAppData = new SLTAppData();
        const apiCall: SLTApiCall = new SLTAppDataApiCall(appData);

        apiCall.call({clientKey, socialId}, (data: any) => {
            console.log(data);
            expect(data).an("object");
            expect(data.experiments).an("array");
            expect(data.features).an("array");
            expect(data.segments).an("array");
            expect(data.saltrUserId).an("string");
            expect(data.levelType).an("string");
            expect(data.success).equal(true);

            const levelList: any[] = [];
            data.features.map((feature: any) => JSON.parse(feature.properties))
                .filter((property: any) => property.levels)
                .map((property: any) => property.levels)
                .forEach((levels: any) => levels.forEach((level: any) => levelList.push(level)));
            const contentUrl: string = levelList[0].url;
            console.log('contentUrl', contentUrl);
            expect(contentUrl).an("string");

            //request level json cdn url
            const apiCall: SLTApiCall = new SLTLevelContentApiCall();
            apiCall.call({contentUrl}, data => {
                console.log(data);
                expect(data).an("object");
                expect(data.version).an("string");
                expect(data.boards).an("object");
                expect(data.propertyObjects).an("object");
                expect(data.assets).an("object");
            });
        });
    });

    it('addPropertiesApiCall', () => {
        sltSaltr.addProperties({}, {});
        const apiCall: SLTApiCall = new SLTAddPropertiesApiCall();
        apiCall.call({clientKey, socialId}, data => {
            console.log(data);
            expect(data.success).equal(true);
            expect(data.message).equal('Player properties are stored successfully');
        });
    });

    it('heartbeatApiCall', () => {
        const apiCall: SLTApiCall = new SLTHeartbeatApiCall();
        apiCall.call({clientKey, socialId}, data => {
            console.log(data);
            expect(data.success).equal(true);
            expect(data.message).equal('Ok');
        }, error => {
            console.log(error);
        });
    });

    it('heartbeatApiCall wrong client key', () => {
        const apiCall: SLTApiCall = new SLTHeartbeatApiCall();
        apiCall.call({clientKey: "random wrong key", socialId}, null,
            (data: SLTStatus) => {
                expect(data.statusCode).equal('VALIDATION_ERROR');
                expect(data.statusMessage).equal('Cannot find an application with the client key.');
            });
    });

    it('heartbeatApiCall no client key', () => {
        const apiCall: SLTApiCall = new SLTHeartbeatApiCall();
        apiCall.call({socialId}, null,
            (data: SLTStatus) => {
                expect(data.statusCode).equal('API_ERROR');
                expect(data.statusMessage).equal('Field clientKey is required');
            });
    });

    it('heartbeatApiCall no socialId', () => {
        const apiCall: SLTApiCall = new SLTHeartbeatApiCall();
        apiCall.call({clientKey}, null,
            (data: SLTStatus) => {
                expect(data.statusCode).equal('API_ERROR');
                expect(data.statusMessage).equal('Field socialId is required');
            });
    });
});