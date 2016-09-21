import glCore from 'pixi-gl-core';

const defaultValue = glCore.shader.defaultValue;

function extractAttributesFromSrc(vertexSrc, mask)
{
    var vertAttributes = extractAttributesFromString(vertexSrc, mask);
    return vertAttributes;
}


function extractAttributesFromString(string)
{
    const maskRegex = new RegExp('^(projectionMatrix|uSampler|filterArea)$');

    const attributesArray = [];
    let nameSplit;


    // clean the lines a little - remove extra spaces / teabs etc
    // then split along ';'
    const lines = string.replace(/\s+/g,' ')
                .split(/\s*;\s*/);

    // loop through..
    for (let i = 0; i < lines.length; i++)
    {
        let line = lines[i].trim();

        if(line.indexOf('attribute') > -1)
        {
            const splitLine = line.split(' ');
            const type = splitLine[1];

            let name = splitLine[2];
            let size = 1;

            if(name.indexOf('[') > -1)
            {
                // array!
                nameSplit = name.split(/\[|\]/);
                name = nameSplit[0];
                size *= Number(nameSplit[1]);
            }

            if(!name.match(maskRegex))
            {
                attributesArray.push({
                    value:defaultValue(type, size),
                    name:name,
                    location:0,
                    type:type
                });
            }
        }
    }

    attributesArray.sort(function(a, b){
        return (a.name > b.name) ? 1:-1;
    });

    const attributes = {};

    // now lets sort them alphabetically..
    for (let i = 0; i < attributesArray.length; i++)
    {
        let attrib = attributesArray[i];
        attrib.location = i;
        attributes[attrib.name] = attrib;
    }

    return attributes;
}

export default extractAttributesFromSrc;
