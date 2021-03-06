<?php

/**
 * Config class
 * @package YetiForce.Config
 * @license licenses/License.html
 * @author Mariusz Krzaczkowski <m.krzaczkowski@yetiforce.com>
 */

class Config
{

	protected static $config;

	public static function get($key, $defvalue = '')
	{
		if (empty(self::$config)) {
			require('config/config.php');
			self::$config = $config;
		}
		if (isset(self::$config)) {
			if (isset(self::$config[$key])) {
				return self::$config[$key];
			}
		}
		return $defvalue;
	}

	/** Get boolean value */
	public static function getBoolean($key, $defvalue = false)
	{
		return self::get($key, $defvalue);
	}
}
