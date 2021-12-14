from dolfin import *
from mshr import * 
import numpy as np
import scipy.io as sio
from ufl import Identity, indices, as_tensor
#from flask_mysqldb import MySQL
from datetime import datetime


#%matplotlib inline

# Rectangle geometry limits
def fmain ():
    zlim, ylim = 70., 1.
    # Porosity level from Mathilde data 
    # this data starts from 1% porosity values!
    #por = 11 # the porosity level is por+1
    # Define domain size 
    size = 350 # Dato importante
    # generate f and create mesh
    domain = Rectangle(Point(0., 0.), Point(zlim, ylim))
    mesh = generate_mesh(domain, size)
    # Compute the minimum height diameter
    print("Minimum height of element [mm]: ", mesh.hmin())
    #File("Domains/2DMesh.pvd") << mesh

    # Define source locations
    # Using notation consistent with the 3D-case
    nsous = 8  #Cantidad de emisores
    zsous, ysous = [n for n in range(10, 25, 2)], nsous*[ylim,]
    eps = DOLFIN_EPS
    width = 0.5

    # Define domain for each source
    class DomSource_1(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[0]) < width + eps and
                    abs(x[1] - ysous[0]) < width + eps and
                    on_boundary)

    class DomSource_2(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[1]) < width + eps and
                    abs(x[1] - ysous[1]) < width + eps and
                    on_boundary)    

    class DomSource_3(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[2]) < width + eps and
                    abs(x[1] - ysous[2]) < width + eps and
                    on_boundary)    

    class DomSource_4(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[3]) < width + eps and
                    abs(x[1] - ysous[3]) < width + eps and
                    on_boundary)    

    class DomSource_5(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[4]) < width + eps and
                    abs(x[1] - ysous[4]) < width + eps and
                    on_boundary)
        
    class DomSource_6(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[5]) < width + eps and
                    abs(x[1] - ysous[5]) < width + eps and
                    on_boundary)
        
    class DomSource_7(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[6]) < width + eps and
                    abs(x[1] - ysous[6]) < width + eps and
                    on_boundary)
        
    class DomSource_8(SubDomain):
        def inside(self, x, on_boundary):
            return (abs(x[0] - zsous[7]) < width + eps and
                    abs(x[1] - ysous[7]) < width + eps and
                    on_boundary)

    # Define source expression
    class Source(UserExpression):
        def __init__(self, time, t_0,
                    sig_time, degree=1, **kwargs):
            super().__init__(**kwargs)
            # initialize atributes
            self.time, self.t_0 = time, t_0
            self.sig_time = sig_time
        
        def eval(self, values, x):
            factor = 1/(2*pow(self.sig_time,2))
            dif_time = self.time - self.t_0
            # Obtaining left side and right sides
            num = exp(-factor*pow(dif_time,2))*cos(2*pi*dif_time)
            # Define values for the vector
            values[0] = 0.0 # the horizontal direction
            values[1] = -num # vertical direction
            # DEBUG CASE!
            #values[1] = -cos(2*pi*dif_time)

        def value_shape(self):
            return (2,)
        
    """
    from IPython.display import HTML
    HTML(X3DOM().html(mesh))
    """
    print("Number of Cells; {0}, of Vertice: {1}".format(mesh.num_cells(),
                                                    mesh.num_vertices()))

    # Define update procedure
    def update(u, u_n, v_n, a_n, beta, gamma, dt):
        """
        Update procedure for the acceleration using the
        beta-Newmark scheme.
        """
        # Obtain vector representation of fields
        u_vec, u_nvec = u.vector(), u_n.vector()
        v_nvec, a_nvec = v_n.vector(), a_n.vector()
        # update using the beta-gamma scheme
        a_vec = (1.0/(beta*pow(dt,2)))*(u_vec-u_nvec-dt*v_nvec) -             ((1-2*beta)/(2*beta))*a_nvec
        # update velocity
        v_vec = v_nvec + dt*((1-gamma)*a_nvec+gamma*a_vec)
        # update fields 
        v_n.vector()[:], a_n.vector()[:] = v_vec, a_vec
        u_n.vector()[:] = u.vector()
        
    ### Step ###

    # Position of sensor to obtain the dforce!
    nsens = 50# Number of sensors separated at 0.4081 mm # RECEPTORES
    zsens, ysens = np.linspace(35, 55, num=nsens), nsens*[ylim,]

    # Define function spaces and boundary conditions
    pdim = 1
    V = VectorFunctionSpace(mesh, 'CG', pdim)
    # Define trial and test functions
    u = TrialFunction(V)
    w = TestFunction(V)

    # Mark subdomains with label 0
    #subdomains = MeshFunction("size_t", mesh, mesh.topology().dim())
    #subdomains.set_all(0)
    # Mark boundaries with label 0
    boundaries = MeshFunction("size_t", mesh, mesh.topology().dim()-1)
    boundaries.set_all(0)

    # Mark boundaries (whenever necessary)
    # Mark domain sources with 2
    DomSource_1().mark(boundaries, 21)
    DomSource_2().mark(boundaries, 22)
    DomSource_3().mark(boundaries, 23)
    DomSource_4().mark(boundaries, 24)
    DomSource_5().mark(boundaries, 25)
    DomSource_6().mark(boundaries, 26)
    DomSource_7().mark(boundaries, 27)
    DomSource_8().mark(boundaries, 28)

    # Define new measure for boundaries
    dx = dx(domain=mesh)
    ds = ds(domain=mesh, subdomain_data=boundaries)

    # Define boundaries over the function space
    # In the variational form are defined the Neumann conditions
    left_jit = "on_boundary && near(x[0], 0.)"
    bc_domain = DirichletBC(V, Constant((0.,0.)), left_jit)

    ### Step ###

    # Obtain the experimental data from .mat file

    #ojo con la ruta
    C_mathilde = sio.loadmat('Files_mat/C_values_mathilde.mat')
    # Define the constants
    # The stiffness constants in [GPa] --> [g/mm(\mu sec)^2]
    # are given by the mathilde .mat file of 5%
    C11 = np.reshape(C_mathilde['C11'], (30,))*1E-3
    C12 = np.reshape(C_mathilde['C12'], (30,))*1E-3
    C13 = np.reshape(C_mathilde['C13'], (30,))*1E-3
    C33 = np.reshape(C_mathilde['C33'], (30,))*1E-3
    C55 = np.reshape(C_mathilde['C55'], (30,))*1E-3
    C66 = np.reshape(C_mathilde['C66'], (30,))*1E-3
    d = np.reshape(C_mathilde['d'], (30,))*1E-3
    C_mathilde.keys()

    ### Step ###

    por = 5 # 6% of porosity # POROSIDAD
    print(""" At {0}% of porosity, density of {1:2.4f},
    C11 = {2:2.4f}, C33 = {3:2.4f}, C55 = {4:2.4f}
    C66 = {5:2.4f}, C12 = {6:2.4f}, C13 = {7:2.4f}
    """.format(por+1, d[por], 
            C11[por], C33[por], C55[por], 
            C12[por], C13[por], C66[por]))

    ### Step ###

    # Comparison of values
    print("""
        At porosity of {0}%; The coeffs:
        C22: {1:.4f}, C33: {2:.4f}
        density d: {3:.6f}
        """.format(por+1,C11[por],C33[por],d[por]))

    ### Step ###

    # Define kronecker delta in 2D and indices
    # Cambios realizados 15/06/2021 debido a la reunión con Rediman.
    delta = Identity(2)
    i,j,k,l = indices(4)

    # Define strain tensor
    def epsilon(u): 
        return as_tensor(0.5*(u[i].dx(j)+u[j].dx(i)),
                        (i,j))

    # Define stiffness tensor C_{i,j,k,l} transverse isotropic
    def VoigtToTensor(A):
        # We use the convention, for long axis 1
        # Upper diagonal part
        A11, A13, A15 = A[0,0], A[0,1], A[0,2]
        A33, A35 = A[1,1], A[1,2]
        A55 = A[2,2]
        # Lower diagonal part (symmetric)
        A31, A51 = A13, A15
        A53 = A35
        
        return as_tensor([           [            [ [A11, A15], [A15, A13]] ,            [ [A51, A55], [A55, A53]]            ],            [
                [ [A51, A55], [A55, A53]] ,\
                [ [A31, A35], [A35, A33]] \
            ] \
                        ])

    # We take the standard density
    rho = d[por] # [g/cm^3] --> [g/(mm)^3]
    # Define the Voigt matrix representing the tensor
    # Here, the 3-axis is the z-axis, and
    # 1-axis in the y-axis or x-axis by the simmetry
    C_voigt = np.array([                   [C33[por], C13[por], 0],                    [C13[por], C11[por], 0],                    [0, 0, C55[por]] 
                    ])
    # Obtain the stiffness tensor
    C = VoigtToTensor(C_voigt)
    # Define stress tensor
    def sigma(u):
        return as_tensor(C[i,j,k,l]*epsilon(u)[k,l], 
                        (i,j))

    ### Step ###

    # Define the three main blocks in variational forms
    def o_block(u, w, dt):
        # Define factor por derivative variational form
        factor_1 = rho/(beta*dt*dt)
        return factor_1*inner(u, w)*dx

    def A_block(u, w):
        return inner(sigma(u), grad(w))*dx

    def b_block(u, u_n, v_n, a_n, w, beta, gamma, dt):
        # Define useful factors
        factor_1 = rho/(beta*dt*dt)
        factor_2 = rho/(beta*dt)
        factor_3 = rho*(1.0-2.0*beta)/(2.0*beta)
        # rhs without force defined from time-derivative rest
        value_wtf = factor_1*inner(u_n, w)*dx +                 factor_2*inner(v_n, w)*dx +                 factor_3*inner(a_n, w)*dx
        # return the sum of value_wtf
        return value_wtf

    def bdry_block(source, w, bdry_id):
        # rhs part containing the force applied at the boundary
        return dot(source, w)*ds(bdry_id)

    # Time array to consider
    # samplign step 1/20, ntimes = 1024
    times = np.arange(0, 51.2, step = 1./20)# experiment ~ 48[\mu sec]
    # Define number of times from array
    ntimes = times.shape[0]
    # Define sensors arrays
    sol_sensors_z = np.zeros((nsens, ntimes, nsous))
    sol_sensors_y = np.zeros((nsens, ntimes, nsous))

    d = u.geometric_dimension()
    u_shape = grad(u).ufl_shape
    print("Geometric dimension of u: {0}".format(d))
    print("UFL shape of grad(u): {0}".format(u_shape))
    """
    # Check the points where the force is applied
    mesh_points = SubsetIterator(boundaries, 21)
    print("Midpoints where the force is applied")

    for data in mesh_points:
        print("Points at boundary 21, ({0},{1}) ".format(
            data.midpoint().x(), data.midpoint().y()))
                
    """
    for ii in range(nsous):
        idx = int(ii + 21)
        count = sum(1 for _ in SubsetIterator(boundaries,idx))
        print("Facet marked as %d have %d points" % (idx, count))

    ### Step ###

    # Check if the points a the left have been taken.
    print("Points at boundary left: ")
    len(bc_domain.get_boundary_values())

    ### Step ###

    #Cambios debido a RecursionError: maximum recursion depth exceeded

    # list all boundaries
    bcs = [bc_domain]
    # Define name solutions for saving with File
    filename = "SimP"+str(por+1)+"TransIso"+str(ylim)+            "M"+str(size)+".pvd"
    filepvd ="Results/"+filename
    vtk_u = File(filepvd)
    # Define file to save data at experiment with sous 2
    #filename_sol = "SimSous6P"+str(por+1)+"TransIso"+str(ylim)+ \
    #               "M"+str(size)+".pvd"
    #filepvd_sol ="Results/"+filename_sol
    #vtk_u_sol = File(filepvd_sol)
    # Parameters for the Newmark scheme
    beta, gamma = 0.36, 0.7
        
    # output the dt time
    dt = times[1]-times[0]
    print("Considering dt: ", dt)
    # Iteration over each source secuentially
    for sous_j in range(nsous):
        # Obtain boundary layer and assemble it!
        bdry_id = int(21 + sous_j)
        # Create functions for variational form definition
        # initialized all as 0.0
        u_sol = Function(V)
        # previous time solutions
        u_n, v_n, a_n = Function(V), Function(V), Function(V)
        
        # Iterate the experiment over time
        for time_i in range(ntimes):
            ## Define Neumann boundary condition for source 
            time, t_0 = float(times[time_i]), 0.0#5.0#t_0 ~ 5 [\mu sec]
            # Define general variance
            sig_time = 0.7 # sig_time ~ 1 [\mu sec]
            source_exp = Source(time=time, t_0=t_0, 
                                sig_time=sig_time, degree=1)
            # Interpolate source over domain
            source = interpolate(source_exp, V)

            # Variational forms for A and assemble!
            A_lhs = o_block(u, w, dt) + A_block(u, w)
            A = assemble(A_lhs)
            
            # Obtain variational part without force
            b_wtf = b_block(u, u_n, v_n, a_n, w, beta, gamma, dt)
            # Obtain variational part of rhs with force at the boundary
            b_wf = bdry_block(source, w, bdry_id)
            b_rhs = b_wtf + b_wf
            # Assemble of lhs
            b = assemble(b_rhs)
            
            # Apply boundary conditions
            [bc.apply(A,b) for bc in bcs]
            
            # Solve the variational problem
            solve(A, u_sol.vector(), b)
                
            # Update fields u, v, a
            update(u_sol, u_n, v_n, a_n, beta, gamma, dt)
            
            # Compute data at the sensors and save it as array
            for sens_k in range(nsens):
                # Obtain point value of solution u
                sensor_point = Point(np.array((zsens[sens_k], ysens[sens_k])))
                # Save data values at the sensor location
                sol_sensors_z[sens_k, time_i, sous_j] = u_sol(sensor_point)[0]
                sol_sensors_y[sens_k, time_i, sous_j] = u_sol(sensor_point)[1]
                    
            if sous_j == 0:
                # Save vtk solution
                #vtk_u << (u_sol, float(time_i)) 
                # Print some info in the iteration
                print("Value at sensor: {0}, with Time: {1} ".format(
                    u_sol(sensor_point)[1], time))
            #if sous_j == 5:
            #    vtk_u_sol << (u_sol, float(time_i))

    ### Step ###

    #create dictionary with variables to save
    savedic = {'zlim': zlim, 'ylim': ylim, 'nsous': nsous,
               'zsous': zsous, 'ysous': ysous, 'nsens': nsens,
               'zsens': zsens, 'ysens': ysens, 'ntimes': ntimes,
               'times': times,
               'sol_sensors_z': sol_sensors_z, 'sol_sensors_y': sol_sensors_y}
    filename = 'Files_mat/TimeSimP'+str(por+1)+'TransIsoW'+            str(ylim)+'M'+str(size)
    sio.savemat(filename, savedic, appendmat=True)
    datetime.now()

fmain()
    # cur = mysql.connection.cursor()
    # cur.execute("UPDATE timesimtransisomat_first_step01 SET p_status = 'Done'  WHERE id = {0};".format(sub_id))
    # mysql.connection.commit()
    # print(f"zlim: {zlim} \n ylim:  {ylim} \n nsous: {nsous} \n \
    #         zsous: {zsous} \n ysous: {ysous} \n nsens: {nsens} \
    #         zsens: {zsens} \n ysens: {ysens}\n ntimes: {ntimes}\n \
    #         times: {times}\n \
    #         sol_sensors_z: {sol_sensors_z},\n sol_sensors_y: {sol_sensors_y}")

    # ## Data Processing and diagram plotting
