`precision highp float;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
attribute vec3 a_position;
varying vec3 v_mars_vertex;
varying vec3 v_mars_viewPos;
uniform mat4 u_mars_modelInverseMatrix;
uniform bool u_mars_modelUpZ;
bool isPointInBound(vec2 point, vec4 bounds)
{
    return (point.x > bounds.x && point.x < bounds.z && point.y < bounds.w && point.y > bounds.y);
}
float unpackDepth(const in vec4 rgba_depth)
{
    const vec4 bitShifts = vec4(1.0, 1.0 / 255.0, 1.0 / (255.0 * 255.0), 1.0 / (255.0 * 255.0 * 255.0));
    float depth = dot(rgba_depth, bitShifts);
    return depth;
}
attribute vec2 a_texcoord_0;
varying vec2 v_texcoord_0;
uniform bvec4 u_mars_IsYaPing;
uniform bvec4 u_mars_editVar;
uniform vec3 u_mars_offset;
uniform sampler2D u_mars_polygonTexture;
uniform vec4 u_mars_polygonBounds;
uniform vec2 u_mars_heightVar;
varying float v_mars_isFlat;
void main(void)
{
    v_mars_vertex = a_position;
    vec3 weightedPosition = a_position;
    vec3 v_mars_tempaPos = a_position;
    v_mars_tempaPos = v_mars_tempaPos - u_mars_offset;
    vec4 position = vec4(weightedPosition, 1.0);
    position = u_modelViewMatrix * position;
    v_mars_viewPos = position.xyz;
    if (!u_mars_modelUpZ) { v_mars_tempaPos = vec3(v_mars_tempaPos.x, 
        -v_mars_tempaPos.z, v_mars_tempaPos.y); } 
        v_mars_tempaPos = (u_mars_modelInverseMatrix * czm_inverseView * position).xyz;
    gl_Position = u_projectionMatrix * position;
    v_texcoord_0 = a_texcoord_0;
    if (u_mars_IsYaPing[0]) {
        vec2 texCoord;
        texCoord.x = (v_mars_tempaPos.x - u_mars_polygonBounds.x) / (u_mars_polygonBounds.z - u_mars_polygonBounds.x);
        texCoord.y = (v_mars_tempaPos.y - u_mars_polygonBounds.y) / (u_mars_polygonBounds.w - u_mars_polygonBounds.y);
        vec4 flatTColor = texture2D(u_mars_polygonTexture, texCoord.xy);
        if ((texCoord.x >= 0.0 && texCoord.x <= 1.0 && texCoord.y >= 0.0 && texCoord.y <= 1.0) 
        && (flatTColor.r > 0.5 && flatTColor.a > 0.5)) {
            v_mars_isFlat = 10.0;
            if (u_mars_IsYaPing[2] || u_mars_IsYaPing[3]) { return; }
            if (u_mars_IsYaPing[1]) {
                if (!u_mars_modelUpZ) { 
                    weightedPosition.y = u_mars_heightVar[0] + u_mars_heightVar[1]; 
                } else { 
                    weightedPosition.z = u_mars_heightVar[0] + u_mars_heightVar[1]; 
                }
                gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(weightedPosition, 1.0);
            } 
            else 
            { 
                v_mars_isFlat = -10.0; 
            }
        } else { 
            v_mars_isFlat = -10.0;
         }
    };
}`