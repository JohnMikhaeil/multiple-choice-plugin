import {InspectorControls , BlockControls , BlockAlignmentToolbar} from '@wordpress/block-editor'
import {TextControl , Flex , FlexBlock , FlexItem , Button , Icon , PanelRow , PanelBody} from '@wordpress/components';
import {BlockPicker} from 'react-color'
import './index.scss';

(function(){
    let lockSave = false;
    wp.data.subscribe(function (){
        const results = wp.data.select('core/block-editor').getBlocks().filter((block)=>{
            return block.name == 'myblockplugin/multiple-choice-plugin' && block.attributes.correctAnswer == undefined
        })
        
        if(results.length && lockSave == false){
            lockSave = true
            wp.data.dispatch('core/editor').lockPostSaving('noanswer')
        }
        if(!results.length && lockSave){
            lockSave = false
            wp.data.dispatch('core/editor').unlockPostSaving('noanswer')
        }
    })
})()


wp.blocks.registerBlockType("myblockplugin/multiple-choice-plugin" , {
    title: "Multiple Choise Question",
    icon: "smiley" ,
    category: "common",
    attributes: {
        question:{type:"string"},
        answers: {type:"array" , default:[""]},
        correctAnswer: {type:"number" , default: undefined},
        bgColor: {type:"string" , default: '#ebebeb'},
        aligment:{type:"string"},
    },
    description: 'Let your users enjoy a multiple choice question!' ,
    example:{attributes:{
        question: 'what is your name?',
        answers:['john' , 'mirihan' , 'monica' ] ,
        correctAnswer:0,
        bgColor: '#ebebeb',
    }},
    edit: BlockUserInterface ,
    save: function (props){
        return null
    }
})


function BlockUserInterface (props) {
    
    function updateQuestion(value) {
        props.setAttributes({question: value})
    }
    function updateAnswer(index , newValue){
        const newAnswers = props.attributes.answers.concat([])
        newAnswers[index] = newValue
        props.setAttributes({answers: newAnswers})

    }
    
    function addAnother(){
        const newAnswers = props.attributes.answers.concat([undefined])
        props.setAttributes({answers : newAnswers})
    }

    function deleteAnswer(indexToDelete){
        const newAnswers = props.attributes.answers.filter(function (x , index){
            return index != indexToDelete
        })
        props.setAttributes({answers: newAnswers})
        if(indexToDelete == props.attributes.correctAnswer){
            props.setAttributes({correctAnswer: undefined })
        }
    }

    function markAsCorrect(correctIndex){
        props.setAttributes({correctAnswer: correctIndex})
    }

    return (
        <div className='block-editor-style' style={{backgroundColor: props.attributes.bgColor}}>
            <BlockControls>
                <BlockAlignmentToolbar value={props.attributes.aligment} onChange={x=>props.setAttributes({aligment: x})} />
            </BlockControls>
            <InspectorControls>
                <PanelBody title='Background Color' initialOpen={true}>
                    <PanelRow>
                        <BlockPicker color={props.attributes.bgColor} onChangeComplete={ x=>props.setAttributes({bgColor:x.hex}) } />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <TextControl  value={props.attributes.question} onChange={updateQuestion} style={{fontSize:"20px"}} label="Question:" />
            <p style={{fontSize:"13px" , margin:"20px 0 8px 0"}}>Answers:</p>
            {props.attributes.answers.map(function (answer , index){
                return(
                    <Flex>
                        <FlexBlock>
                            <TextControl autoFocus={answer == undefined ? true : false} value={answer} onChange={(value)=>updateAnswer(index , value)} />
                        </FlexBlock>
                        <FlexItem>
                            <Button onClick={()=>markAsCorrect(index)}>
                                <Icon className='correct-answer-star' icon={ index == props.attributes.correctAnswer ? "star-filled" : "star-empty"}/>
                            </Button>
                        </FlexItem>
                        <FlexItem>
                            <Button onClick={()=>deleteAnswer(index)} className="delete-button" isLink>Delete</Button>
                        </FlexItem>
                    </Flex>
            )})}
            <Button isPrimary onClick={addAnother}>Add Another Answer</Button>
        </div>
    )
}