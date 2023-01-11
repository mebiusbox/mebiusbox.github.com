uniform sampler2D ColorSampler;
uniform vec2 Resolution;
varying vec2 vUv;

void main() 
{
    vec2 texelSize = (1.0 / Resolution);
    vec4 result = vec4(0.0);

    for (int i=-2; i<=2; i++) {
        for (int j=-2; j<=2; j++) {
            vec2 offset = ((vec2(float(i),float(j)))*texelSize);
            result += texture2D(ColorSampler, vUv+offset);
        }
    }

    gl_FragColor = result / (5.0*5.0);
}