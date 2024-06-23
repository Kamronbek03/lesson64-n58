import React, { Component } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: JSON.parse(localStorage.getItem("students")) || [],
      group: localStorage.getItem("student_group") || "all",
      search: "",
      modalShow: false,
      selected: null,
      form: { firstName: "", lastName: "", group: "REACT 1", doesWork: false },
    };
  }

  componentDidUpdate(_, prevState) {
    if (prevState.students !== this.state.students) {
      localStorage.setItem("students", JSON.stringify(this.state.students));
    }
    if (prevState.group !== this.state.group) {
      localStorage.setItem("student_group", this.state.group);
    }
  }

  handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { students, form, selected } = this.state;
    if (selected === null) {
      this.setState({ students: [...students, form] });
    } else {
      const updatedStudents = students.map((el, i) =>
        i === selected ? form : el
      );
      this.setState({ students: updatedStudents });
    }
    this.setState({
      modalShow: false,
      form: { firstName: "", lastName: "", group: "REACT 1", doesWork: false },
      selected: null,
    });
  };

  handleEdit = (index) => {
    this.setState({
      selected: index,
      form: this.state.students[index],
      modalShow: true,
    });
  };

  handleDelete = (index) => {
    if (confirm("Do you want to delete this student?")) {
      const updatedStudents = this.state.students.filter((_, i) => i !== index);
      this.setState({ students: updatedStudents });
    }
  };

  render() {
    const { students, group, search, modalShow, form, selected } = this.state;
    const filteredStudents = students
      .filter(
        (student) =>
          student.firstName.toLowerCase().includes(search.toLowerCase()) ||
          student.lastName.toLowerCase().includes(search.toLowerCase())
      )
      .filter((student) => group === "all" || student.group === group);

    return (
      <Container>
        <InputGroup className="my-3">
          <FormControl
            className="input"
            placeholder="Searching"
            aria-label="Searching"
            value={search}
            onChange={(e) => this.setState({ search: e.target.value })}
          />
          <div className="buttons">
            <div className="select">
              <Form.Select
                value={group}
                onChange={(e) => this.setState({ group: e.target.value })}
              >
                <option value="all">All</option>
                <option value="REACT 1">REACT 1</option>
                <option value="REACT 11">REACT 11</option>
                <option value="REACT 13">REACT 13</option>
                <option value="REACT 15">REACT 15</option>
              </Form.Select>
            </div>
            <div className="add-btn">
              <Button
                variant="outline-success"
                onClick={() => this.setState({ modalShow: true })}
              >
                Add student
              </Button>
            </div>
          </div>
        </InputGroup>
        <Table striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Group</th>
              <th>Does work?</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.group}</td>
                <td>{student.doesWork ? "Ha" : "Yo'q"}</td>
                <td className="text-end">
                  <Button variant="primary" onClick={() => this.handleEdit(i)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" onClick={() => this.handleDelete(i)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal
          show={modalShow}
          onHide={() => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selected === null ? "Adding student" : "Editing student"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={this.handleFormChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please fill this field!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={this.handleFormChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please fill this field!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Select group</Form.Label>
                <Form.Select
                  name="group"
                  value={form.group}
                  onChange={this.handleFormChange}
                >
                  <option value="REACT 1">REACT 1</option>
                  <option value="REACT 11">REACT 11</option>
                  <option value="REACT 13">REACT 13</option>
                  <option value="REACT 15">REACT 15</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="doesWork"
                  label="Does work?"
                  checked={form.doesWork}
                  onChange={this.handleFormChange}
                />
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => this.setState({ modalShow: false })}
                >
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  {selected === null ? "Add" : "Save"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
}

export default App;
