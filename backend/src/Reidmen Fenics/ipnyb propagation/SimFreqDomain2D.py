from dolfin import *
from mshr import *
import scipy.io as sio
import numpy as np
from datetime import datetime
import time
import pandas as pd
from ufl import Identity, indices, as_tensor, imag, real
import math


def fmain (n_transmitter, n_receiver, distance, emitter_pitch, receiver_pitch, sensor_edge_margin, typical_mesh_size, plate_thickness, plate_size, sensor_width, porosity, attenuation, id):
    
    Hora_inicio = datetime.now()

    print('Parametros: ', n_transmitter, n_receiver, distance, emitter_pitch, receiver_pitch, sensor_edge_margin, typical_mesh_size, plate_thickness, plate_size, sensor_width, porosity, attenuation, id)

    # Obtain the experimental data from .mat file
    #C_mathilde = sio.loadmat(r"src/Reidmen Fenics/ipnyb propagation/Files_mat/C_values_mathilde.mat")

    # Define the constants
    # The stiffness constants in [GPa] --> [g/mm(\mu sec)^2]
    # are given by the mathilde .mat file of 5%
    #print('WITH ATTENUATION')
    path = 'src/Reidmen Fenics/ipnyb propagation/Files_mat/attenuation'
    M = pd.read_csv(path + '.csv').values
    # First dimension: porosity
    p = np.arange(0.01, 0.48, 0.01)
    dDD = 2.03 * (1 - p) + p

        # Calculate omega
    #frequency = 1e-3 # frequency value
    #omega = 2 * np.pi * frequency
        # Second dimension
    C22 = M[:, 0] # %=C11
    C66 = M[:, 1]
    C33 = M[:, 2]
    C23 = M[:, 3] # %=C13
    C55 = M[:, 4] # %=C44
    C12 = M[:, 5]

    D11 = M[:, 6]
    D66 = M[:, 7]
    D33 = M[:, 8]
    D13 = M[:, 9]
    D55 = M[:, 10]
    D12 = M[:, 11] 

    C11 = C22
    C13 = C23
    d = 2.03 * (1 - p) + p
    #C_mathilde.keys()

    # Rectangle geometry limits
    zlim=(2*sensor_edge_margin) + (n_transmitter*emitter_pitch) + distance + (n_receiver*receiver_pitch)
    ylim = plate_thickness

    # Porosity level from Mathilde data 
    # this data starts from 1% porosity values!
    por = porosity # the porosity level is por+1
    
    # Define domain size 
    dxt = distance 
    size =  zlim/dxt # Dato importante
    
    # generate f and create mesh
    domain = Rectangle(Point(0., 0.), Point(zlim, ylim))
    mesh = generate_mesh(domain, size)

    # Compute the minimum height diameter
    print("Minimum height of element [mm]: ", mesh.hmin())

    # Define source locations
    # Using notation consistent with the 3D-case
    nsous = n_transmitter#1 #Cantidad de emisores
    zsous = [n for n in range(sensor_edge_margin, sensor_edge_margin + ((n_receiver-1)*emitter_pitch), emitter_pitch)]
    ysous =  nsous*[ylim*1,]

    # Position of sensor to obtain the force!
    nsens = n_receiver#1# Number of sensors separated at 0.4081 mm # RECEPTORES
    zsens = np.linspace(sensor_edge_margin + n_transmitter + distance, sensor_edge_margin+ n_transmitter*emitter_pitch+distance + (n_receiver-1)*receiver_pitch, num=nsens)
    ysens = nsens*[ylim*1,]

    # Parameters of Source definition
    eps = DOLFIN_EPS
    width = sensor_width #antes era 0.5 sens_width

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
        def __init__(self, freq, freq_0,
                    sig_freq, degree=1, **kwargs):
            super().__init__(**kwargs)
            # initialize atributes
            self.freq, self.freq_0 = freq, freq_0
            self.sig_freq = sig_freq
        
        def eval(self, values, x):
            ## Case using Fourier transform with -2*pi on the oscilation
            t_0 = 5.0 # [\mu s]
            sig2 = pow(self.sig_freq,2)
            pi2 = pow(pi,2)
            factor = sqrt(pi*sig2/2)*sin(-2*pi*self.freq*self.freq_0)
            sum_freq = (self.freq_0 + self.freq)
            dif_freq = (self.freq_0 - self.freq)
            # Obtaining left side and right sides
            num_ls = exp(-2*sig2*pi2*pow(sum_freq,2))
            num_rs = exp(-2*sig2*pi2*pow(dif_freq,2))
            values[0] = 0.0 # the horizontal direction
            values[1] = -factor*(num_ls+num_rs) # vertical direction
                
        def value_shape(self):
            return (2,)
    
    print("Number of Cells; {0}, of Vertice: {1}".format(mesh.num_cells(),
                                                    mesh.num_vertices()))
    
    # Mark boundaries with label 0
    boundaries = MeshFunction("size_t", mesh, mesh.topology().dim()-1)
    boundaries.set_all(0)

    # Mark boundaries (whenever necessary)
    # Mark domain sources with 2
    dom = {
        'DomSource_1':DomSource_1,
        'DomSource_2':DomSource_2,
        'DomSource_3':DomSource_3,
        'DomSource_4':DomSource_4,
        'DomSource_5':DomSource_5,
        'DomSource_6':DomSource_6,
        'DomSource_7':DomSource_7,
        'DomSource_8':DomSource_8

    }
    for i in range(nsous):
        name = "DomSource_"+str(i+1)
        func = dom[name]
        func().mark(boundaries, 20+i+1)

    # Define new measure for boundaries
    global dx
    global ds
    dx = dx(domain=mesh)
    ds = ds(domain=mesh, subdomain_data=boundaries)

    # Define function spaces and boundary conditions
    pdim = 1
    VV = VectorFunctionSpace(mesh, 'CG', pdim)

    # Define boundaries over the function space
    # In the variational form are defined the Neumann conditions
    left_jit = "on_boundary && near(x[0], 0.)"
    bc_domain = DirichletBC(VV, Constant((0.,0.)), left_jit)


    # Define kronecker delta in 2D and indices
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
        
        return as_tensor([\
            [\
                [ [A11, A15], [A15, A13]] ,\
                [ [A51, A55], [A55, A53]] \
            ], \
            [
                [ [A51, A55], [A55, A53]] ,\
                [ [A31, A35], [A35, A33]] \
            ] \
                        ])
    
    """_____________________C VALUES_____________________"""
    # We take the standard density
    rho = d[por] # [g/cm^3] --> [g/(mm)^3]
    # Define the Voigt matrix representing the tensor
    # Here, the 3-axis is the z-axis, and
    # 1-axis in the y-axis or x-axis by the simmetry
    C_voigt = np.array([\
                    [C33[por], C13[por], 0], \
                    [C13[por], C11[por], 0], \
                    [0, 0, C55[por]] 
                    ])
    # Obtain the stiffness tensor
    C = VoigtToTensor(C_voigt)

    """_____________________D VALUES_____________________"""
    # We take the standard density
    rho = dDD[por] # [g/cm^3] --> [g/(mm)^3]
    # Define the Voigt matrix representing the tensor
    # Here, the 3-axis is the z-axis, and
    # 1-axis in the y-axis or x-axis by the simmetry
    D_voigt = np.array([\
                    [D33[por], D13[por], 0], \
                    [D13[por], D11[por], 0], \
                    [0, 0, D55[por]] 
                    ])
    # Obtain the stiffness tensor
    D = VoigtToTensor(D_voigt)
    
    """_____________________FUNCTIONS_____________________"""
    # Define stress tensor
    def sigma(u,omega=''):
        if omega:
            return as_tensor(omega*D[i,j,k,l]*epsilon(u)[k,l], 
                        (i,j))
        return as_tensor(C[i,j,k,l]*epsilon(u)[k,l], 
                        (i,j))

    # Define the three main blocks in variational forms
    def o_block(u, v, omega):
        return -rho*pow(omega,2)*inner(u, v)*dx
        #return -rho*pow(omega,2)*inner(grad(imag(u)), grad(imag(v))) * dx

    def A_block(u, v,omega=''):
        if omega:
            return inner(sigma(u,omega), grad(v))*dx
        return inner(sigma(u), grad(v))*dx
        #return  inner(grad(real(u)), grad(real(v)))

    def b_block(source, v, bdry_id):
        return dot(source, v)*ds(bdry_id)

    # Frequency array to consider
    freqs = np.arange(0., 2., step=20/2048)# ~ [MHz], step=20/2048
    omegas = 1j*2*pi*freqs
    print(omegas)
    # Define number of frequencies
    nfreq = freqs.shape[0]
    # Define sensors arrays
    sol_sensors_z = np.zeros((nsens, nfreq, nsous))
    sol_sensors_y = np.zeros((nsens, nfreq, nsous))


    """_____________________INFO_____________________"""
    # Print number of point at the boundary
    print("Total number of points at the boundary", 
        len(bc_domain.get_boundary_values()))

    # Check the points where the force is applied
    mesh_points = SubsetIterator(boundaries, 28)
    print("Midpoints where the force is applied")
    for ii in range(nsous):
        idx = int(ii + 21)
        count = sum(1 for _ in SubsetIterator(boundaries,idx))
        print("Facet marked as %d have %d points" % (idx, count))
    #for data in mesh_points:
    #    print("Points at boundary 28, ({0},{1}) ".format(
    #        data.midpoint().x(), data.midpoint().y()))
    
    # Check if the points a the left have been taken.
    print("Points at boundary left: ", len(bc_domain.get_boundary_values()))

    ## Iterate of freq. and solution saving for a point sensor
    # Define trial and test functions
    u = TrialFunction(VV)
    v = TestFunction(VV)

    # Shape and dimension
    d = u.geometric_dimension()
    u_shape = grad(u).ufl_shape
    print("Geometric dimension of u: {0}".format(d))
    print("UFL shape of grad(u): {0}".format(u_shape))

    # list all boundaries
    bcs = [bc_domain]

    # Define name solutions for saving with File
    #filename = "SimP"+str(por+1)+"TransIso"+str(ylim)+ \
    #           "M"+str(size)+"Freq.pvd"
    #filepvd ="Results/"+filename
    #vtk_u = File(filepvd)
        
    # Iteration over each frequency
    for freq_i in range(nfreq):
        ## Define Neumann boundary condition for source 
        freq, freq_0 = float(freqs[freq_i]), 0.5#freq_0 ~ 1 [MHz]
        print("THE FREQ:{} | THE FREQ 0:{}".format(freq,freq_0))
        # Define general variance
        sig_freq = 0.7 # sig_freq ~ 0.7 [Mhz]
        source_exp = Source(freq=freq, freq_0=freq_0,
                            sig_freq=sig_freq, degree=1)
        # Interpolate source over domain
        source = interpolate(source_exp, VV)

        # Variational forms
        A_lhs = o_block(u,v,omegas[freq_i]) + A_block(u,v)
        # print("A_lhs",'-'*8,A_lhs)
        A = assemble(A_lhs)
        # Apply source sequentially 
        for sous_j in range(nsous):   
            # Define function-solution
            u_sol = Function(VV)
            # Compute bounda ry layer
            bdry_id = int(21 + sous_j)
            b_rhs = b_block(source, v, bdry_id)
            
            # Assemble of matrices
            b = assemble(b_rhs)
            # Apply boundary conditions
            [bc.apply(A,b) for bc in bcs]
            # DEBUG!
            #print("Value rhs: ", np.linalg.norm(np.array(b), ord=2))
            # Solve the variational problem
            solve(A, u_sol.vector(), b)
                
            # Compute data at the sensors and save it as array
            for sens_k in range(nsens):
                # Obtain point value of solution u
                sensor_point = Point(np.array((zsens[sens_k], ysens[sens_k])))
                # Save data values at the sensor location
                sol_sensors_z[sens_k, freq_i, sous_j] = u_sol(sensor_point)[0]
                sol_sensors_y[sens_k, freq_i, sous_j] = u_sol(sensor_point)[1]
                
            if sous_j == 0:
                # Save vtk solution
                #vtk_u << (u_sol, float(freq_i))   
                # Print some info about the solutions
                print("Value at sensor: {0}, with freq: {1:.3f} [MHz]".format(
                    u_sol(sensor_point)[1], freq))
                #print("Value rhs", np.linalg.norm(b, ord=2))

    savedic = {'zlim': zlim, 'ylim': ylim, 'nsous': nsous,
          'zsous': zsous, 'ysous': ysous, 'nsens': nsens,
          'zsens': zsens, 'ysens': ysens, 'nfreq': nfreq,
          'freqs': freqs, 'omegas': omegas,
          'sol_sensors_z': sol_sensors_z, 'sol_sensors_y': sol_sensors_y}
    filename1 = 'src/Reidmen Fenics/ipnyb propagation/Files_mat/TimeSimP'+str(por+1)+'TransIsoW'+ str(ylim)+'M'+str(size) + str(id) + '.mat'
    filename = 'TimeSimP'+str(por+1)+'TransIsoW'+ str(ylim)+'M'+str(size) + str(id) + '.mat'
    #sio.savemat(filename1, savedic, appendmat=True)

    ## Zona de Pruebas de tiempo ##

    Hora_final = datetime.now()
    print(Hora_final)
    tiempo_ejecucion = Hora_final - Hora_inicio
    #tiempo_ejecucion.strftime('%H:%M %p')
    print("Tiempo de ejecución",tiempo_ejecucion)

    #Save file into database
    return filename,tiempo_ejecucion