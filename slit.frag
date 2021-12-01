// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Math
const float pi = 3.141592;
const float tau = 2. * pi;

// Experiment
const int samples_per_slit = 10;
const int n_slits = 2;
const float slit_sep = 0.5;
const float slit_width = slit_sep / 4.;
const float wavelength = 0.01;

// Display
const float wall_width = 0.02;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    bool in_wall = abs(st.x) < wall_width;
    
    const float slit_step = slit_width + slit_sep;
    const float top = slit_step * float(n_slits - 1) / 2.;
    
    float intensity = 0.;
    
    for (int i = 0; i < n_slits; i++) {
        float y = top - slit_step * float(i);
        
        // Wall holes
        bool in_slit = abs(st.y - y) < slit_width / 2.;
        in_wall = in_wall && !in_slit;
        
        // Wave samples
        for (int s = 0; s < samples_per_slit; s++) {
            float k = float(s) / float(samples_per_slit);
            float sy = k * slit_width + y - slit_width / 2.;
            intensity += distance(vec2(0, sy), st);
        }
    }
    
    intensity /= float(n_slits * samples_per_slit);
    
   	vec3 color = vec3(in_wall) + vec3(intensity);
    
    
    gl_FragColor = vec4(color,1.0);
}
