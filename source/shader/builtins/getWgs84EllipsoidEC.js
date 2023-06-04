const shader = `czm_ellipsoid czm_getWgs84EllipsoidEC()
{
    vec3 radii = vec3(6378137.0, 6378137.0, 6356752.314245);
    vec3 inverseRadii = vec3(1.0 / radii.x, 1.0 / radii.y, 1.0 / radii.z);
    vec3 inverseRadiiSquared = inverseRadii * inverseRadii;
    czm_ellipsoid temp = czm_ellipsoid(czm_view[3].xyz, radii, inverseRadii, inverseRadiiSquared);
    return temp;
}`
export default shader;
