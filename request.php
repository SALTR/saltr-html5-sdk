<?php
/**
 * Created by IntelliJ IDEA.
 * User: Gor Ghazaryan
 * Date: 5/31/14
 * Time: 3:49 PM
 */

header("Content-type: json/application");
echo '{"status":"SUCCEED","responseData":{"levelPacks":[{"token":"PACK_1","index":0,"levels":[{"id":21961,"index":0,"url":"https://api.saltr.com/static_data/4974054e-b909-9ce3-9a9a-76189233ab40/levels/29713.json","version":2},{"id":21962,"index":1,"url":"https://api.saltr.com/static_data/4974054e-b909-9ce3-9a9a-76189233ab40/levels/29714.json","version":2}]},{"token":"PACK_2","index":1,"levels":[{"id":21963,"index":0,"url":"https://api.saltr.com/static_data/4974054e-b909-9ce3-9a9a-76189233ab40/levels/29715.json","version":2}]}],"features":[{"token":"TEST_FEATURE","data":{"maxScore":1000}}],"experimentInfo":[{"token":"FEATURE_EXPERIMENT","partition":"A","type":"feature","trackingType":"all"}],"saltrUserId":"30147bad-40d4-446d-a9fc-1951b7cfe70d"}}';
