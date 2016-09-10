<?php
/**
 * Plugin Name: pagenav
 * Plugin URI: http://reinvdwoerd.herokuapp.com
 * Description: Developed for Sailing
 * Version: 0.1
 * Author: Rein van der Woerd
 * Author URI: http://reinvdwoerd.herokuapp.com
 * License: -
 */

add_action('admin_menu', 'pagenav_setup');

if (!is_admin())
{
  add_action('wp_enqueue_scripts', 'pagenav_load');
}

function pagenav_load ()
{
  wp_enqueue_style('pagenav.css', plugin_dir_url( __FILE__ ) . 'pagenav.css');
  wp_enqueue_script('jquery-nearest.js', plugin_dir_url( __FILE__ ) . 'deps/jquery-nearest.js', null, null, true);
  wp_enqueue_script('velocity.js', plugin_dir_url( __FILE__ ) . 'deps/velocity.js', null, null, true);
  wp_enqueue_script('pagenav.js', plugin_dir_url( __FILE__ ) . 'pagenav.js', null, null, true);
}

function pagenav_setup ()
{
  $page_title = 'pagenav';
  $menu_title = 'pagenav';
  $capability = 'manage_options';
  $menu_slug  = 'pagenav-options';
  $function   = 'pagenav_options';

  add_options_page($page_title, $menu_title, $capability, $menu_slug, $function);
}

function pagenav_options ()
{

  echo "<h2>The pagenav has been added to your site.</h2>";

}
