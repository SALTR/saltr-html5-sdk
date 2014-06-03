<?php
/**
 * Created by IntelliJ IDEA.
 * User: Gor Ghazaryan
 * Date: 6/3/14
 * Time: 3:34 PM
 */

header("Content-type: application/json");
echo file_get_contents($_GET["url"]);
