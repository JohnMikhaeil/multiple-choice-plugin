<?php
/*
plugin name: Multiple Choise Question
Description: Plugin that create block of multiple choise question
version: 1.0.0
author: John wagih
plugin domain: muqdomain
domain path: /languages
*/
if(! defined('ABSPATH') ) exit;
class multipleChoiseQuestion{
    function __construct(){
        add_action ('init', array($this , 'adminAssets'));
    }
    function adminAssets(){
        wp_register_style('mainStyles' , plugin_dir_url(__FILE__). 'build/index.css');
        wp_register_script('mainPlugin' , plugin_dir_url(__FILE__). 'build/index.js' , array('wp-blocks' , 'wp-element' , 'wp-editor'));
        register_block_type( 'myblockplugin/multiple-choice-plugin', array(
            'editor_script' => 'mainPlugin',
            'editor_style' => 'mainStyles',
            'render_callback' => array($this , 'blockOutput'),
        ));
    }
    function blockOutput($attributes){

        if(!is_admin()){
            wp_enqueue_script('frontendScript' , plugin_dir_url(__FILE__) .'build/frontend.js' , array("wp-element"));
            wp_enqueue_style('frontendStyles' , plugin_dir_url(__FILE__).'build/frontend.css');
        }
        ob_start();
        ?>
        <div class="block-frontend-div"><pre style="display:none"><?php echo wp_json_encode($attributes) ?></pre></div>
        <?php
        $output = ob_get_clean();
        return $output;
    }
}

$multipleChoiseQuestion = new multipleChoiseQuestion();