export const vertexShader = `    
    precision highp float;

    // Atributos de los vértices
    attribute vec3 position; 	
    attribute vec3 normal; 	
    attribute vec2 uv;		 	

    // Uniforms
    uniform mat4 modelMatrix;		// Matriz de transformación del objeto
    uniform mat4 worldNormalMatrix;	// Matriz de normales
    uniform mat4 viewMatrix;		// Matriz de transformación de la cámara
    uniform mat4 projectionMatrix;	// Matriz de proyección de la cámara

    // Varying
    varying vec2 vUv;	    // Coordenadas de textura que se pasan al fragment shader
    varying vec3 vNormal;	// Normal del vértice que se pasa al fragment shader
    varying vec3 vWorldPos;	// Posición del vértice en el espacio  de mundo

    void main() {
        
        // Lee la posición del vértice desde los atributos

        vec3 pos = position;	

        // Se calcula la posición final del vértice
        // Se aplica la transformación del objeto, la de la cámara y la de proyección

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);

        // Se pasan las coordenadas de textura al fragment shader
        vUv = uv;
        vNormal = normalize(vec3(worldNormalMatrix * vec4(normal, 0.0)));
        vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    }
`;

export const fragmentShader = `
    precision mediump float;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    
    uniform float snowThresholdLow;
    uniform float snowThresholdHigh;

    uniform float sandThresholdLow;
    uniform float sandThresholdHigh;


    uniform vec3 sunDirection;

    uniform sampler2D dirtSampler;
    uniform sampler2D rockSampler;
    uniform sampler2D grassSampler;
    uniform sampler2D sandSampler;

    void main(void) {


        vec2 uv=vUv*8.0;
        vec3 grass=texture2D(grassSampler,uv).xyz;
        vec3 dirt=texture2D(dirtSampler,uv*4.0).xyz;                
        vec3 rock=texture2D(rockSampler,uv).xyz;
        vec3 sand=texture2D(sandSampler,uv).xyz;   
        vec3 snow=vec3(1.0,1.0,1.0);     
        
        
        float verticallity=1.0-max(0.0,vNormal.y);
        float flatness=1.0-verticallity;
        float lightIntensity=0.5+0.5*max(0.0,dot(vNormal,sunDirection));
        

        // Queremos que haya rocas en las zonas más verticales
        float rockFactor=smoothstep(0.3,0.5,verticallity);

        // La nieve aparece en las zonas más altas
        float snowFactor=smoothstep(snowThresholdLow,snowThresholdHigh,vWorldPos.y)*smoothstep(0.5,0.8,flatness);

        // La arena aparece en las zonas más bajas
        float sandFactor=smoothstep(sandThresholdLow,sandThresholdHigh,vWorldPos.y)*smoothstep(0.2,0.5,flatness);

        // mezcla de pasto y tierra
        vec3 grassDirt=mix(grass,dirt,0.3);

        // mezcla de pasto y tierra con rocas
        vec3 grassDirtRock=mix(grassDirt,rock,rockFactor);
        
        // mezcla de pasto, tierra, rocas y nieve
        vec3 grassDirtRockSnow=mix(grassDirtRock,snow,snowFactor);

        // mezcla de pasto, tierra, rocas y arena
        vec3 grassDirtRockSand=mix(grassDirtRock,sand,sandFactor);

        // mezcla de pasto, tierra, rocas, nieve y arena
        vec3 grassDirtRockSandSnow=mix(grassDirtRockSand,snow,snowFactor);

        vec3 color=grassDirtRockSandSnow*lightIntensity;

        gl_FragColor = vec4(color,1.0);	  
    }
    `;
